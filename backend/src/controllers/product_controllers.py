# Controllers to route to required functions

from flask import request, jsonify
from middlewares.auth_middleware import check_session, get_current_user
from database_functions.product import get_all_products, get_product_by_id, create_product, update_product, delete_product, log_into_pg

class ProductController:
    @check_session
    def get_all(self):
        products = get_all_products()
        if not products:
            return jsonify({"error": "Products not found"}), 404
        return jsonify({"status":True, "data":products}), 200

    @check_session
    def get_one(self, product_id):
        product = get_product_by_id(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        return jsonify(product), 200

    @check_session
    def create(self):
        data = request.get_json()
        status, result = create_product(data.get('productData'))
        event_state = data.get('eventState')
        user_id = get_current_user()
        if not status:
            return jsonify({"status":False,"message":f"Failed {result}"}), 404
        pg_log_status, pg_log_message = log_into_pg(user_id, result, event_state)
        return jsonify({"id": result, "message": "Product created successfully"}), 201

    @check_session
    def update(self, product_id):
        data = request.get_json()
        success, success_message = update_product(product_id, data.get('editedProduct'))
        print(f'Success status {success}')
        user_id = get_current_user()
        if not success:
            return jsonify({"error": success_message}), 404
        pg_log_status, pg_log_message = log_into_pg(user_id, product_id, "UPDATE")
        return jsonify({"message": "Product updated successfully"}), 200

    @check_session
    def delete(self, product_id):
        user_id = get_current_user()
        print(f'USer id is: {user_id}')
        success = delete_product(product_id)
        if not success:
            return jsonify({"error": "Product not found"}), 404
        pg_log_status, pg_log_message = log_into_pg(user_id, product_id, "DELETE")
        return jsonify({"message": "Product deleted successfully"}), 200
