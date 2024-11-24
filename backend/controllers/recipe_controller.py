from flask import request, jsonify
import requests

def get_recipes(ingredients_list):
    """
    Get top 5 recipes with matching ingredients and return
    NOTE: does not get recipe info, but rather returns the id numbers to be used to search further
    Args:
        ingredients_list (list : str): List of expiring ingredients
    """

    api_ingredients = ",+".join(ingredients_list)
    print(api_ingredients)

    url = f"https://api.spoonacular.com/recipes/findByIngredients?apiKey=a6fb9076765142499de63cdfa13fff0a&ingredients={api_ingredients}&number=5"
    
    response = requests.get(url)
    data = response.json()
    
    recipe_return = []
    for recipe in data:
        current_id = recipe['id']
        current_recipe = get_recipe_by_id(current_id)
        recipe_return.append(current_recipe)
    
    #print(recipe_return)
    return {"recipes": recipe_return}
    
    
def get_recipe_by_id(id_num):
    url = f"https://api.spoonacular.com/recipes/{id_num}/information?apiKey=a6fb9076765142499de63cdfa13fff0a"
    
    response = requests.get(url)
    recipe_data = response.json()

    # Extract the main recipe details
    title = recipe_data.get("title", "No Title")
    servings = recipe_data.get("servings", "N/A")
    ready_in_minutes = recipe_data.get("readyInMinutes", "N/A")
    instructions = recipe_data.get("instructions", "No Instructions Provided")
    ingredients = recipe_data.get("extendedIngredients", [])
    image_url = recipe_data.get("image", "No Image Available")

    # Format ingredients
    formatted_ingredients = [
        {
            "name": ingredient.get("name", "Unknown Ingredient"),
            "amount": ingredient.get("amount", ""),
            "unit": ingredient.get("unit", "")
        }
        for ingredient in ingredients
    ]

    # Prepare the recipe details as a JSON object
    recipe_details = {
        "title": title,
        "servings": servings,
        "ready_in_minutes": ready_in_minutes,
        "instructions": instructions,
        "ingredients": formatted_ingredients,
        "image_url": image_url
    }
    print(recipe_details)

    return recipe_details

