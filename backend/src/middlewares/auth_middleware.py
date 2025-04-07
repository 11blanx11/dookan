import jwt
from functools import wraps
from flask import request, jsonify, g
from config import Config
from database_functions.pg_setup import get_db_connection

# Check if token valid and is part of active sessions in PG
def check_session(func):
    @wraps(func)
    def decorator(*args, **kwargs):
        session_token = None
        # Check if token exists in the request headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            # We are passing Bearer Auth with structure Bearer <jwt-token>
            try:
                session_token = auth_header.split(" ")[1]
            except IndexError:
                session_token = auth_header
        
        if not session_token:
            return jsonify({'message': 'Authorization Failed'}), 401
        
        if not check_session_pg(session_token):
            return jsonify({'message': "This Session doesn't exist anymore. Please Login Again"}), 401

        try:
            # Decode the token
            token_payload = jwt.decode(session_token, Config.SECRET_KEY, algorithms=["HS256"])
            # Store user info in g object for access in the route
            g.user_id = token_payload.get('user_id')
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Session expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 404
            
        return func(*args, **kwargs)
    
    return decorator

def check_session_pg(session_token):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            query = f"""
            SELECT * FROM user_sessions WHERE session_token = '{session_token}';
            """
            cur.execute(query)
            rows = cur.fetchall()
            row_count = len(rows)
    if row_count > 0:
        return True
    else:
        return False


def get_current_user():
    return getattr(g, 'user_id', None)

