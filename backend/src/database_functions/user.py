import bcrypt
import jwt
import sys
import pytz
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson import ObjectId
from .mongo_setup import users_collection
from .pg_setup import get_db_connection
from config import Config

# sys.path.insert(1,'/home/blanx/Documents/codes/dookan-assignment/backend')

def create_user(username, password):
    try:
        user = list(users_collection.find({'user_name':username}))
        if not (len(user)) == 0:
            return False, 'User Already Exists'
        entered_pwd = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
        result = users_collection.insert_one({
            'user_name':username,
            'password':entered_pwd
        })
        print(result)
        return True, str(result.inserted_id)
    except Exception as e:
        return False, str(e)

def validate_user(username, password):
    print('Entered user authentication')
    user = list(users_collection.find({'user_name':username}))
    if not (len(user) == 1):
        print('More than one username found')
        return False, 'Multiple Usernames associated' if len(user) > 1 else 'No Users found' 
    hashed_pwd = user[0]['password']
    entered_pwd = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    print(f'the entered password is: {entered_pwd}')
    login_status = bcrypt.checkpw(password.encode(),hashed_pwd)
    return login_status, 'Successful Login', str(user[0].get('_id'))


def generate_session_token(username,user_id):
    token_payload = {
        'user_id': user_id,  
        'exp': datetime.now() + timedelta(seconds = int(Config.JWT_REFRESH_TOKEN_EXPIRY))
    }

    token = jwt.encode(
        token_payload,
        Config.SECRET_KEY,
        algorithm="HS256"
    )

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            query = f"""
            INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES ('{user_id}','{token}','{token_payload.get('exp')}');
            """
            print(f'Query: {query}')
            cur.execute(query)
            conn.commit()

    return {
        'token': token,
        'expires_in': [Config.JWT_REFRESH_TOKEN_EXPIRY],
        'token_payload':token_payload
    }
            
def end_active_session(user_id, session_token):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                query = f"""
                DELETE FROM user_sessions WHERE user_id = '{user_id}' AND session_token = '{session_token}';
                """
                print(f'Logout Query: {query}')
                cur.execute(query)
                conn.commit()
        return True,'Successfully Deleted'

    except Exception as e:
        return False, str(e)