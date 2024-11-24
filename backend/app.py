from flask import Flask, request, jsonify
from flask_cors import CORS
from controllers.recipe_controller import get_recipes, get_recipe_by_id
from controllers.grocery_controller import add_items, view_items, delete_item
import requests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/add_items', methods=['POST'])
def add_items_route():
    data = request.json 
    image_items = data.get("image_items", []) 
    user = data.get("user")  
    
    if not image_items or not user:
        return jsonify({"error": "Missing required fields: image_items or user"}), 400
    try:
        add_items(image_items, user)
        return jsonify({"message": "Items added successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/view_items', methods=['GET'])
def view_items_route():
    return view_items()

@app.route('/delete_item', methods=['DELETE'])
def delete_item_route():
    return delete_item()

@app.route('/get_recipes', methods=['GET'])
def get_recipes_route():
    return get_recipes()

if __name__ == "__main__":
    app.run(debug=True)
