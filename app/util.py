import boto3
import re
import random
import os

def get_data():
    regex = r'output\/www_(\d|[a-f,A-F])'
    bucket = 'intelli-product-scraper-prod'
    folders = []

    client = boto3.client('s3')
    result = client.list_objects(Bucket=bucket, Delimiter="/", Prefix="output/")
    for obj in result["CommonPrefixes"]:
        folders.append(f"s3://{bucket}/{obj['Prefix']}/*.json")
    return folders[:100]


def download_data(folder_count):
    bucket = 'intelli-product-scraper-prod'
    folders = []

    client = boto3.client('s3')
    folders = client.list_objects(Bucket=bucket, Delimiter="/", Prefix="output/")['CommonPrefixes']

    for i in random.sample(range(0, 999), folder_count):
        for obj in client.list_objects(Bucket=bucket, Delimiter="/", Prefix=folders[i]['Prefix'])['Contents']:
            file_parts = obj['Key'].split('.json')
            fixed_name = file_parts[0].replace(":", "_").replace(".", "_") + ".json"
            if not os.path.exists(os.path.dirname(fixed_name)):
                os.makedirs(os.path.dirname(fixed_name))
            client.download_file(bucket, obj['Key'], fixed_name)  # save to same path

if __name__ == '__main__':
    download_data(50)