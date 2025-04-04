# Controllers to route to required functions

from flask import request, jsonify
from middlewares.auth_middleware import check_session
from database_functions.product import get_all_products, get_product_by_id, create_product, update_product, delete_product

class ProductController:
    @check_session
    def get_all(self):
        products = get_all_products()
        if not products:
            return jsonify({"error": "Products not found"}), 404
        return jsonify(products), 200

    @check_session
    def get_one(self, product_id):
        product = get_product_by_id(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        return jsonify(product), 200
    
    @check_session
    def create(self):
        data = request.get_json()
        status, result = create_product(data)
        if not status:
            return jsonify({"status":False,"message":f"Failed due to {result}"}), 404
        return jsonify({"id": result, "message": "Product created successfully"}), 201
    
    @check_session
    def update(self, product_id):
        data = request.get_json()
        success = update_product(product_id, data)
        if not success:
            return jsonify({"error": "Product not found"}), 404
        return jsonify({"message": "Product updated successfully"}), 200
    
    @check_session
    def delete(self, product_id):
        success = delete_product(product_id)
        if not success:
            return jsonify({"error": "Product not found"}), 404
        return jsonify({"message": "Product deleted successfully"}), 200