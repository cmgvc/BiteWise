from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from controllers.recipe_controller import get_recipes, get_recipe_by_id
from controllers.grocery import add_items, view_items
from controllers.auth_controller import login, register

app = Flask(__name__)
CORS(app)

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

# @app.route('/delete_item', methods=['DELETE'])
# def delete_item_route():
#     return delete_item()

@app.route('/get_recipes', methods=['GET'])
def get_recipes_route():
    return get_recipes()

@app.route('/login', methods=['POST'])
def login_route():
    try:
        data = request.get_json()
        print(f"Received data: {data}")
        
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"error": "Missing username or password"}), 400
        user = login(username, password)
        
        if user:
            return jsonify(user), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/register', methods=['POST'])
def handle_register():
    try:
        data = request.get_json()  
        print(f"Received data: {data}")
        username = data['username']
        email = data['email']
        password = data['password']
        registered_user = register(username, email, password)
        
        if registered_user:
            return jsonify({"message": f"User {registered_user} registered successfully."}), 200
        else:
            return jsonify({"error": "Username or email already exists."}), 400
    except KeyError as e:
        return jsonify({"error": f"Missing parameter: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
