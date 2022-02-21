import boto3
import re

def get_data():
    regex = r'output\/www_(\d|[a-f,A-F])'
    bucket = 'intelli-product-scraper-prod'
    folders = []

    client = boto3.client('s3')
    result = client.list_objects(Bucket=bucket, Delimiter="/", Prefix="output/")
    for obj in result["CommonPrefixes"]:
        folders.append(f"s3://{bucket}/{obj['Prefix']}/*.json")
    return folders[:100]


if __name__ == '__main__':
    print(get_data())