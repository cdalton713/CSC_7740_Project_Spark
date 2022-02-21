from fastapi import FastAPI
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from util import get_data
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
data = session.read.parquet(*get_data()).option("multiline", True).json("data/**/*.json")


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


@app.get("/store/{store_url}/product/{product_id}/variants")
def get_product_variants(store_url: str, product_id: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url)
    product_filter = store_filter.filter(col('id') == product_id)
    variants = product_filter.select('id', 'datetime_captured', explode('variants')).select('id', 'datetime_captured', 'col.title', 'col.price').distinct().orderBy(desc('datetime_captured'))

    latest = variants.first()
    filtered_first_only = variants.filter(col('datetime_captured') == latest.datetime_captured).collect()
    resp = []
    for row in filtered_first_only:
        resp.append({"name": row.title + " - $" + str(row.price)})
    return resp


@app.get("/store/{store_url}/product/count")
def get_product_count_by_store(store_url: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url)
    return store_filter.count()


@app.get("/store/{store_url}/variant/count")
def get_variant_count_by_store(store_url: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url)
    return store_filter.select("id", explode("variants")).count()


@app.get("/store/{store_url}/product_type/avg_variant_count")
def get_variant_count_by_product(store_url: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url)
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

    store_filter = data.filter(col("site.url") == store_url)
    tags = store_filter.groupBy("product_type").count().orderBy(desc("count")).collect()

    resp = []
    for row in tags:
        resp.append({"vizType": row[0], "count": row[1]})
    return resp


@app.get("/store/{store_url}/vendors")
def get_vendors(store_url: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url)
    vendors = store_filter.groupBy("vendor").count().orderBy(desc("count")).collect()

    resp = []
    for row in vendors:
        resp.append({"vizType": row[0], "count": row[1]})
    return resp


@app.get("/store/{store_url}/product_type/average_price")
def get_average_price_per_product_type(store_url: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url)
    explode_variants = store_filter.select("product_type", explode("variants"))
    avgs = explode_variants.groupBy("product_type").avg("col.price").withColumnRenamed("avg(col.price AS price)", 'avg').orderBy(desc("avg")).collect()

    resp = []
    for row in avgs:
        resp.append({"vizType": row[0], "count": row[1]})
    return resp


@app.get("/store/{store_url}/product/{product_id}/price_over_time")
def get_product_price_over_time(store_url: str, product_id: str):
    if "https://" not in store_url:
        store_url = "https://" + store_url

    store_filter = data.filter(col("site.url") == store_url)
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
        pending_resp[row.title].append([row.datetime_captured, row.price])

    final_resp = []
    for key, value in pending_resp.items():
        final_resp.append({"title": key, "values": value})

    return final_resp


if __name__ == "__main__":
    get_product_variants('https://www.aquatalia.com', '6569627582536')
    # get_variant_count_by_product("https://www.aquatalia.com")
