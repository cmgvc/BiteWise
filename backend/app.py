from flask import Flask
from controllers.recipe_controller import get_recipes, get_recipe_by_id
from controllers.grocery_controller import add_item, view_items, delete_item
import requests


app = Flask(__name__)

@app.route('/')
def home():

    return "Hello, Flask!"


app.route('/add_item', methods=['POST'])(add_item)
app.route('/view_items', methods=['GET'])(view_items)
app.route('/delete_item', methods=['DELETE'])(delete_item)

if __name__ == "__main__":
    app.run(debug=True)
