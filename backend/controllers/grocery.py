from io import StringIO
import pandas as pd
import boto3
import datetime
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
aws_access_key_id = os.getenv("aws_access_key_id")
aws_secret_access_key = os.getenv("aws_secret_access_key")
region_name = os.getenv("region_name")
bucket_name = 'grocerydata'
s3_file_key = 'fridge.csv'

GEMINI_API_KEY = "AIzaSyD-iy1I3QLCT9poiVu9FmMWtYjBVNCTxFQ"
genai.configure(api_key=GEMINI_API_KEY)

s3 = boto3.client('s3', 
                  aws_access_key_id=aws_access_key_id,
                  aws_secret_access_key=aws_secret_access_key,
                  region_name=region_name)

def categorize_and_expiry_gemini(food_name):
    payload = {
        "query": f"Classify the food item '{food_name}' into categories: Fruit, Vegetable, Meat, Dairy, Grain, Processed Food, or Other. Also, provide a typical expiry date based on common storage practices. The expiry date should be one number in unit days. Return the result in this format: 'Category: <category>, Expiry: <expiry_date>'"
    }

    model = genai.GenerativeModel(model_name="gemini-1.5-flash")
    response = model.generate_content(payload["query"])
    response_str = response.text.strip()
    dictionary = dict(item.split(": ") for item in response_str.split(", "))
    return dictionary

def add_items(image_items, user):
    """
    Append items from `image_items` to the fridge.csv in S3 according to user with Gemini categorization and expiry prediction.

    Args:
        image_items (list of str): List of items to be added.
        user (str): Person who's added the items to their fridge
    """
    new_data_list = []
    date_purchased = datetime.date.today()

    for item in image_items:
        dict_result = categorize_and_expiry_gemini(item)
        category = dict_result["Category"]
        expiry_result = dict_result["Expiry"]
        expiry_date = date_purchased + datetime.timedelta(days=int(expiry_result))
        new_data_list.append({
                "Food Item": item,
                "User": user,
                "Category": category,
                "Date Purchased": date_purchased,
                "Expiry Date": expiry_date,
            })

    new_data = pd.DataFrame(new_data_list)

    try:
        response = s3.get_object(Bucket=bucket_name, Key=s3_file_key)
        csv_content = response['Body'].read().decode('utf-8')
        existing_data = pd.read_csv(StringIO(csv_content))
        updated_data = pd.concat([existing_data, new_data], ignore_index=True)
    
    except s3.exceptions.NoSuchKey:
        updated_data = new_data

    csv_buffer = StringIO()
    updated_data.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)

    try:
        s3.put_object(Bucket=bucket_name, Key=s3_file_key, Body=csv_buffer.getvalue())
        print("File uploaded successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")

def view_items(user):
    """View all items by user from the fridge.csv on S3."""
    try:
        response = s3.get_object(Bucket=bucket_name, Key=s3_file_key)
        csv_content = response['Body'].read().decode('utf-8')
        df = pd.read_csv(StringIO(csv_content))
        user_items = df[df["User"] == user]
        print(user_items["Food Item"].to_string(index=False))
    except Exception as e:
        print(f"An error occurred: {e}")