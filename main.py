from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pathlib import Path
import os
import shutil
import requests
from typing import List

session = SparkSession.builder.appName('App').getOrCreate()
data = session.read.option("multiline", True).json('data/**/*.json')


# %% Count per Product Type
count_per_product_type_df = data.select(col('id'), col('product_type'), col('vendor'), col('site.*')).groupby(
    'product_type').count().orderBy(desc("count")).show(50, False)

# %% Count per Vendor
count_per_vendor_df = data.select(col('id'), col('product_type'), col('vendor'), col('site.*')).groupby(
    'vendor').count().show()

# %% Map variants to ID
variants_df = data.select(data.id, explode(data.variants))

# %% Variants per product
variants_df.groupby('id').count().show()

# %% Aggregate variant price
variants_df.groupby('id').agg(min('col.price'), max('col.price'), avg('col.price')).show()

# %% Compare at Price Difference
variants_df.withColumn('price_between_compare', col('col.compare_at_price') - col('col.price')).groupby('id').agg(
    min('price_between_compare'), max('price_between_compare'), avg('price_between_compare')).show()


# %% Load Google Taxonomy
def load_google_taxonomy() -> List[str]:
    resp = requests.get("http://www.google.com/basepages/producttype/taxonomy.en-GB.txt").text
    return resp.split('\n')



# %% Rename all files
files = Path('./data').glob("**/*.json")

for file in files:
    try:
        shutil.copy(file,
                    str(file.parent.joinpath(file.stem.replace(":", "_").replace(".", "_")).absolute()) + ".json")
    except shutil.SameFileError:
        pass
    else:
        os.remove(file)

if __name__ == '__main__':
    taxonomy_lines = load_google_taxonomy()

    taxonomy_dict = {}
    for line in taxonomy_lines:
        parts = [_.strip() for _ in line.split(">")]

        for i in range(len(parts)):
            if i == 0:
                if parts[i] not in taxonomy_dict:
                    taxonomy_dict[parts[i]] = {}
            elif 0 < i < len(parts) - 1:
                pass
            else:
                pass
        for p in parts:
            if p not in taxonomy_dict:
                taxonomy_dict[p] = {}


