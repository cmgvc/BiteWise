from flask import request, jsonify
import pandas as pd
import datetime
import google.generativeai as genai

GEMINI_API_KEY = "AIzaSyD-iy1I3QLCT9poiVu9FmMWtYjBVNCTxFQ"
GEMINI_API_URL = "https://api.gemini-platform.com/v1/classify"
genai.configure(api_key=GEMINI_API_KEY)

def add_items(image_items, user):
    """
    Append items from `image_items` to the "Food Item" column in 'fridge.csv' according to user.

    Args:
        image_items (list of str): List of items to be added.
        user (str): Person who's added the items to their fridge
    """
    #df = pd.read_csv("Food_Database.csv")
    new_data_list = []
    date_purchased = datetime.date.today()
    #storage_type = "Ambiant"

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
                #"Storage Temperature" : storage_type
            })
    new_data = pd.DataFrame(new_data_list)
    new_data.to_csv('fridge.csv', mode='a', index=False, header=False, encoding='utf-8')


# do we want to only view items or also view expiry?
def view_items(user):
    """
    View all items by user.

    Args:
        user (str): Person who's added the items to their fridge
    """
    df = pd.read_csv("fridge.csv")
    user_items = df[df["User"] == user]
    print(user_items["Food Item"].to_string(index=False))




def view_items(user):
    """
    View all items by user.

    Args:
        user (str): Person who's added the items to their fridge
    """
    df = pd.read_csv("fridge.csv")
    user_items = df[df["User"] == user]
    print(user_items["Food Item"].to_string(index=False))

def categorize_and_expiry_gemini(food_name):
    payload = {
        "query": f"Classify the food item '{food_name}' into categories: Fruit, Vegetable, Meat, Dairy, Grain, Processed Food, or Other. Also, provide a typical expiry date based on common storage practices. The expiry date should be one number in unit days. Return the result in this format: 'Category: <category>, Expiry: <expiry_date>'"
    }

    model = genai.GenerativeModel(model_name="gemini-1.5-flash")
    response = model.generate_content(payload["query"])
    response_str = response.text.strip()
    print(response_str)
    dictionary = dict(item.split(": ") for item in response_str.split(", "))
    print(dictionary)
    return dictionary
    

def delete_item(food_name, username):
    import csv

    # File path to the CSV file
    file_path = "fridge.csv"

    # Temporary storage for updated rows
    updated_rows = []

    # Read the CSV file and process rows
    with open(file_path, "r") as file:
        csv_reader = csv.reader(file)
        header = next(csv_reader)  # Read and save the header row
        updated_rows.append(header)  # Keep the header

        item_found = False
        for row in csv_reader:
            # Check if the username matches
            if row[1].strip().lower() == username.strip().lower():
                # If food_name matches, do not append this row (delete it)
                if row[0].strip().lower() == food_name.strip().lower():
                    item_found = True  # Food item to delete is found
                else:
                    updated_rows.append(row)  # Keep rows where food doesn't match
            else:
                updated_rows.append(row)  # Keep rows for other users

    # Write updated rows back to the CSV file
    with open(file_path, "w", newline="") as file:
        csv_writer = csv.writer(file)
        csv_writer.writerows(updated_rows)

    # Return a meaningful message
    if item_found:
        return f"Food item '{food_name}' was successfully removed for user '{username}'."
    else:
        return f"Food item '{food_name}' was not found for user '{username}'."


def main():
    user1 = "Emily"
    user2 = "Chloe"

    grocery1 = ["apple", "banana"]
    grocery2 = ["apple", "bread", "milk"]

    #add_items(grocery1, user1)
    #add_items(grocery2, user2)

    view_items(user1)

    food_name = "apple"
    #print(openai.api_key)

    #category, expiry_days, expiry_date = categorize_and_expiry_gpt(food_name)

    #print(f"{food_name.capitalize()} is categorized as {category}. Typical expiry is {expiry_days} days.")
    #print(f"Estimated expiry date: {expiry_date}")

    #category, expiry_days, expiry_date = categorize_and_expiry_gemini(food_name)

    #print(f"{food_name.capitalize()} is categorized as {category}. Typical expiry is {expiry_days} days.")
    #print(f"Estimated expiry date: {expiry_date}")
    #model = genai.GenerativeModel(model_name="gemini-1.5-flash")
    #response = model.generate_content("Explain how AI works")
    #print(response.text)
    #categorize_and_expiry_gemini(food_name)


if __name__ == "__main__":
    main()
