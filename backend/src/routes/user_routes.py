
from flask import Blueprint
from controllers.user_auth_controllers import UserAuthController

user_auth_bp = Blueprint('user_auth', __name__)

user_auth_controller = UserAuthController()

user_auth_bp.route('/create', methods=['POST'])(user_auth_controller.add_user)
user_auth_bp.route('/login', methods = ['POST'])(user_auth_controller.check_user_credentials)
user_auth_bp.route('/logout',methods = ['POST'])(user_auth_controller.logout)