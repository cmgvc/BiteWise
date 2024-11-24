from io import StringIO
import pandas as pd
import boto3
from dotenv import load_dotenv
import os

load_dotenv()

aws_access_key_id = os.getenv("aws_access_key_id")
aws_secret_access_key = os.getenv("aws_secret_access_key")
region_name = os.getenv("region_name")
s3 = boto3.client('s3', 
                  aws_access_key_id=aws_access_key_id,
                  aws_secret_access_key=aws_secret_access_key,
                  region_name=region_name)

bucket_name = 'grocerydata'
s3_file_key = 'users.csv'

def register(username, email, password):
    new_user = pd.DataFrame({"Username": [username], "Email": [email], "Password": [password]})
    try:
        response = s3.get_object(Bucket=bucket_name, Key=s3_file_key)
        csv_content = response['Body'].read().decode('utf-8')
        existing_users = pd.read_csv(StringIO(csv_content))
        if (existing_users["Username"] == username).any() or (existing_users["Email"] == email).any():
            print("Error: Username or email already exists.")
            return None
        updated_users = pd.concat([existing_users, new_user], ignore_index=True)
    except s3.exceptions.NoSuchKey:
        updated_users = new_user

    csv_buffer = StringIO()
    updated_users.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)

    try:
        s3.put_object(Bucket=bucket_name, Key=s3_file_key, Body=csv_buffer.getvalue())
        print(f"User {username} registered successfully.")
        return username
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def login(username, password):
    try:
        response = s3.get_object(Bucket=bucket_name, Key=s3_file_key)
        csv_content = response['Body'].read().decode('utf-8')
        users = pd.read_csv(StringIO(csv_content))
        user = users[(users["Username"] == username) & (users["Password"] == password)]
        if not user.empty:
            print(f"Login successful! Welcome, {username}.")
            return username
        else:
            print("Error: Invalid username or password.")
            return "None"
    except s3.exceptions.NoSuchKey:
        print("Error: No users found.")
        return "None"
    except Exception as e:
        print(f"An error occurred: {e}")
        return "None"

def logout(username):
    print(f"User {username} logged out.")
    return True

def main():
    print(register("Chloe", "chloe@example.com", "password123"))
    print(register("Emily", "emily@example.com", "password456"))
    print(login("Chloe", "password123"))
    print(login("Emily", "wrongpassword"))
    logout("Chloe")

if __name__ == "__main__":
    main()
