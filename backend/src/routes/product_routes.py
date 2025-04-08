from flask import Blueprint
from controllers.product_controllers import ProductController

product_bp = Blueprint('product_bp', __name__)

product_controller = ProductController()

product_bp.route('/', methods=['GET','OPTIONS'])(product_controller.get_all)
product_bp.route('/<product_id>', methods=['GET'])(product_controller.get_one)
product_bp.route('/', methods=['POST'])(product_controller.create)
product_bp.route('/<product_id>', methods=['PUT'])(product_controller.update)
product_bp.route('/<product_id>', methods=['DELETE'])(product_controller.delete)