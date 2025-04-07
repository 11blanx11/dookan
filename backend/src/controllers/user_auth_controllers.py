# src/resources/user_controllers.py

import datetime
import jwt
from config import Config
from flask import request, jsonify, make_response
from database_functions.user import create_user, validate_user, generate_session_token, end_active_session
from middlewares.auth_middleware import check_session, get_current_user
# Helper function to convert datetime objects to strings for JSON serialization
def serialize_datetime(obj):
    if isinstance(obj, datetime.datetime):
        return obj.isoformat()
    return obj

class UserAuthController:
    def add_user(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email').lower()
        status, result = create_user(username, email, password)
        return jsonify({'status':status,'username':username,'message':result}), 200 if status else 500

    def check_user_credentials(self):
        data = request.get_json()
        email = data.get('email').lower()
        password = data.get('password')
        login_status, login_message, user_id, user_name = validate_user(email ,password)
        if not login_status:
            return jsonify({'status':False, 'email':email, "message":login_message}), 401
        session_token = generate_session_token(email, user_id)
        resp = make_response(jsonify({'status':True, 'email':email, 'userId':user_id, 'userName':user_name}), 200)
        # Setting up Bearer token to retain session_token and user_id
        resp.headers['Authorization'] = f"Bearer {session_token.get('token')}" 
        return resp
    
    @check_session
    def verify_user_session(self):
        return jsonify({'message':'Valid Session'}),200


    @check_session
    def logout(self):
        user_id = get_current_user()
        auth_header = request.headers['Authorization']
        session_token = auth_header.split(" ")[1]
        session_status, session_message = end_active_session(user_id, session_token)
        if not session_status:
            return jsonify({'status':False, 'user_id':user_id, 'message':f'Session Termination Failed due to {session_message}'}), 500
        return jsonify({'status':True, 'message':'Logout Successful'})
        # Delete row from PG
    

# class UserAuthResource(Resource):
#     """User authentication resource."""
    
#     @parse_params(
#         {'name': 'email', 'type': str, 'required': True},
#         {'name': 'password', 'type': str, 'required': True}
#     )
#     def post(self, email, password):
#         """Authenticate a user."""
#         # Check credentials
#         if not UserRepository.check_password(email, password):
#             return {"message": "Invalid credentials"}, 401
        
#         # Get user details
#         user = UserRepository.get_by_email(email)
        
#         # Check if user is active
#         if not user['is_active']:
#             return {"message": "User account is inactive"}, 403
        
#         # In a real application, you would generate a JWT token here
#         return {
#             "message": "Login successful",
#             "user_id": user['id'],
#             "email": user['email'],
#             "is_admin": user['is_admin']
#         }, 200