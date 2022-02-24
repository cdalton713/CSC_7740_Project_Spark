from fastapi import FastAPI
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from dateutil import parser

MODE = "local"

app = FastAPI(
    title="Shopify Data Parser",
    version="0.0.1",
)
origins = ["http://localhost:3000", "localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

session = SparkSession.builder.appName("App").getOrCreate()

if MODE == "local":
    data = session.read.option("multiline", True).json("data-test/**/*.json")


@app.get("/store/urls")
def get_distinct_stores():
    stores = (
        data.filter("datetime_captured is not null")
        .select("site.url")
        .distinct()
        .collect()
    )

    resp = []
    for row in stores:
        resp.append({"url": row.url})

    return resp


@app.get("/store")
def get_store(cols: Optional[str] = None, where: Optional[str] = None):
    store_filter = data
    if where:
        for condition in where.split(","):
            store_filter = store_filter.filter(condition)

    if cols:
        store_filter = store_filter.selectExpr(*cols.split(","))

    return store_filter.toJSON().collect()


@app.get("/store/{store_url}/products")
def get_store_products(store_url: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    filtered_data = (
        data.filter(col("site.url") == store_url)
        .filter("datetime_captured is not null")
        .select("title", "handle", "site.url", "id")
        .distinct()
        .orderBy(asc("title"))
        .collect()
    )

    resp = []
    for row in filtered_data:
        resp.append(
            {
                "title": row.title,
                "handle": row.handle,
                "siteUrl": row.url,
                "productId": row.id,
            }
        )
    return resp


@app.get("/store/{store_url}/productTypes/avg_price_over_time")
def avg_product_type_price_over_time(store_url: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url).filter(
        "datetime_captured is not null"
    )
    exploded = store_filter.select(
        "product_type", "datetime_captured", explode("variants")
    )

    final = (
        exploded.groupBy("product_type", "datetime_captured").avg("col.price").collect()
    )

    top_product_types = store_filter.groupBy("product_type").count().orderBy(desc("count")).limit(20).collect()

    top_product_types_list = []
    for pt in top_product_types:
        top_product_types_list.append(pt[0])

    pending_resp = {}
    for row in final:
        if row.product_type in top_product_types_list:
            if row.product_type not in pending_resp:
                pending_resp[row.product_type] = []
            try:
                pending_resp[row.product_type].append(
                    [parser.parse(row.datetime_captured).timestamp(), row[2]]
                )
            except:
                pass

    final_resp = []
    for key, value in pending_resp.items():
        final_resp.append({"title": key, "values": value})

    return final_resp


@app.get("/store/{store_url}/productsWithPriceChanges")
def get_store_products(store_url: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url).filter(
        "datetime_captured is not null"
    )

    exploded = store_filter.select(
        "title", "handle", "site.url", "id", explode("variants")
    )
    renamed = (
        exploded.withColumn("variant_id", col("col.id"))
        .select("title", "handle", "url", "id", "variant_id", "col.price")
        .distinct()
    )
    final = (
        renamed.groupBy("title", "handle", "url", "id", "variant_id")
        .count()
        .filter(col("count") > 1)
        .collect()
    )

    resp = []
    for row in final:
        resp.append(
            {
                "title": row.title,
                "handle": row.handle,
                "siteUrl": row.url,
                "productId": row.id,
            }
        )
    return resp


@app.get("/store/{store_url}/product/{product_id}/variants")
def get_product_variants(store_url: str, product_id: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url).filter(
        "datetime_captured is not null"
    )
    product_filter = store_filter.filter(col("id") == product_id)
    variants = (
        product_filter.select("id", "datetime_captured", explode("variants"))
        .select("id", "datetime_captured", "col.title", "col.price")
        .distinct()
        .orderBy(desc("datetime_captured"))
    )

    latest = variants.first()
    filtered_first_only = variants.filter(
        col("datetime_captured") == latest.datetime_captured
    ).collect()
    resp = []
    for row in filtered_first_only:
        resp.append({"name": row.title + " - $" + str(row.price)})
    return resp


@app.get("/global/sites/count")
def site_count():
    resp = (
        data.filter("datetime_captured is not null")
        .select("site.url")
        .distinct()
        .count()
    )
    return resp


@app.get("/global/products/count")
def product_count():
    resp = (
        data.filter("datetime_captured is not null")
        .groupBy("site.url")
        .agg(countDistinct("id"))
        .groupBy()
        .sum("count(id)")
        .collect()
    )
    return resp[0]


@app.get("/global/products/avgCount")
def avg_product_count_per_site():
    resp = (
        data.filter("datetime_captured is not null")
        .groupBy("site.url")
        .agg(countDistinct("id"))
        .groupBy()
        .avg("count(id)")
        .collect()
    )
    return resp[0]


@app.get("/global/data/daysPerSite")
def days_per_site():
    final = (
        data.filter("datetime_captured is not null")
        .withColumn("date", split(col("datetime_captured"), "T").getItem(0))
        .groupBy("date", "site.url")
        .count()
        .groupBy("url")
        .count()
        .orderBy(desc("count"))
        .collect()
    )

    resp = []
    for row in final:
        resp.append({"vizType": row[0], "count": row[1]})
    return resp


@app.get("/global/productCountOverTime")
def product_count_over_time():
    final = (
        data.filter("datetime_captured is not null")
        .groupBy("site.url", "datetime_captured")
        .agg(count("id"))
        .orderBy(asc("url"), asc("datetime_captured"))
        .collect()
    )

    pending_resp = {}
    for row in final:
        if row.url not in pending_resp:
            pending_resp[row.url] = []
        try:
            pending_resp[row.url].append(
                [parser.parse(row.datetime_captured).timestamp(), row[2]]
            )
        except:
            pass

    final_resp = []
    for key, value in pending_resp.items():
        final_resp.append({"title": key, "values": value})

    return final_resp


@app.get("/global/avgProductPrice")
def average_product_price_over_time():
    explode_variants = data.select(
        "site.url", "id", "datetime_captured", explode("variants")
    ).filter("datetime_captured is not null")

    final = (
        explode_variants.groupBy("url", "datetime_captured")
        .avg("col.price")
        .orderBy(asc("url"), asc("datetime_captured"))
        .collect()
    )
    pending_resp = {}
    for row in final:
        if row.url not in pending_resp:
            pending_resp[row.url] = []
        try:
            pending_resp[row.url].append(
                [parser.parse(row.datetime_captured).timestamp(), row[2]]
            )
        except:
            pass

    final_resp = []
    for key, value in pending_resp.items():
        final_resp.append({"title": key, "values": value})

    return final_resp


@app.get("/store/{store_url}/product/count")
def get_product_count_by_store(store_url: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url).filter(
        "datetime_captured is not null"
    )
    resp = store_filter.agg(countDistinct("id")).groupBy().sum("count(id)").collect()
    return resp[0]


@app.get("/store/{store_url}/variant/count")
def get_variant_count_by_store(store_url: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url).filter(
        "datetime_captured is not null"
    )
    exploded = store_filter.select("id", explode("variants"))

    part1 = exploded.groupBy("id").agg(countDistinct("col.id"))
    resp = (
        part1.withColumnRenamed("count(col.id)", "count")
        .groupBy()
        .sum("count")
        .collect()
    )
    return resp[0]


@app.get("/store/{store_url}/product_type/avg_variant_count")
def get_variant_count_by_product(store_url: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url).filter(
        "datetime_captured is not null"
    )
    exploded = store_filter.select("product_type", "id", explode("variants"))
    renamed = (
        exploded.withColumn("variant_id", col("col.id"))
        .select("variant_id", "product_type", "id")
        .distinct()
    )
    final = (
        renamed.groupBy("product_type", "id")
        .count()
        .groupBy("product_type")
        .avg("count")
        .orderBy(desc("avg(count)"))
        .collect()
    )

    resp = []
    for row in final:
        resp.append({"vizType": row[0], "count": row[1]})
    return resp


@app.get("/store/{store_url}/product_type")
def get_product_types(store_url: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url).filter(
        "datetime_captured is not null"
    )
    tags = store_filter.groupBy("product_type").count().orderBy(desc("count")).collect()

    resp = []
    for row in tags:
        resp.append({"vizType": row[0], "count": row[1]})
    return resp


@app.get("/store/{store_url}/vendors")
def get_vendors(store_url: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url).filter(
        "datetime_captured is not null"
    )
    vendors = store_filter.groupBy("vendor").count().orderBy(desc("count")).collect()

    resp = []
    for row in vendors:
        resp.append({"vizType": row[0], "count": row[1]})
    return resp


@app.get("/store/{store_url}/product_type/average_price")
def get_average_price_per_product_type(store_url: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url).filter(
        "datetime_captured is not null"
    )
    explode_variants = store_filter.select("product_type", explode("variants"))
    avgs = (
        explode_variants.groupBy("product_type")
        .avg("col.price")
        .withColumnRenamed("avg(col.price AS price)", "avg")
        .orderBy(desc("avg"))
        .collect()
    )

    resp = []
    for row in avgs:
        resp.append({"vizType": row[0], "count": row[1]})
    return resp


@app.get("/store/{store_url}/product/{product_id}/price_over_time")
def get_product_price_over_time(store_url: str, product_id: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url).filter(
        "datetime_captured is not null"
    )
    product_filter = store_filter.filter(col("id") == product_id)

    product_variants = product_filter.filter("datetime_captured is not null").select(
        product_filter.id,
        product_filter.datetime_captured,
        explode(product_filter.variants),
    )

    final = (
        product_variants.withColumn("variant_id", col("col.id"))
        .select("variant_id", "datetime_captured", "col.price", "col.title")
        .orderBy("variant_id", "datetime_captured")
    )
    final_data = final.collect()

    pending_resp = {}
    for row in final_data:
        if row.title not in pending_resp:
            pending_resp[row.title] = []
        try:
            pending_resp[row.title].append(
                [parser.parse(row.datetime_captured).timestamp(), row.price]
            )
        except:
            pass

    final_resp = []
    for key, value in pending_resp.items():
        final_resp.append({"title": key, "values": value})

    return final_resp


if __name__ == "__main__":
    # get_product_variants("https://www.aquatalia.com", "6569627582536")
    # get_variant_count_by_store("https://www.bluemercury.com")
    avg_product_type_price_over_time("https://www.bluemercury.com")
    # product_count()
    # days_per_site()
