from flask import request, jsonify


def add_item():
    return "add_item"

def view_items():
    return "view_items"





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



