from flask import request, jsonify
import csv
import pandas as pd

def add_items(image_items, user):
    """
    Append items from `image_items` to the "Food Item" column in 'fridge.csv' according to user.

    Args:
        image_items (list of str): List of items to be added.
        user (str): Person who's added the items to their fridge
    """
    df = pd.read_csv("fridge.csv")
    new_data = pd.DataFrame({"Food Item": image_items, "User": [user] * len(image_items)})
    new_data.to_csv('fridge.csv', mode='a', index=False, header=False, encoding='utf-8')

def view_items(user):
    """
    View all items by user.

    Args:
        user (str): Person who's added the items to their fridge
    """
    df = pd.read_csv("fridge.csv")
    user_items = df[df["User"] == user]
    print(user_items["Food Item"].to_string(index=False))

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

    add_items(grocery1, user1)
    add_items(grocery2, user2)

    view_items(user1)

    """    with open('fridge.csv', mode='a', newline='', encoding='utf-8') as csv_file:
        output_writer = csv.writer(csv_file)
        for item in image_items:
            output_writer.writerow([item])
    """
if __name__ == "__main__":
    main()
