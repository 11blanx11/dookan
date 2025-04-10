# src/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    MONGODB_URI = os.environ.get('MONGODB_URI')
    DEBUG = os.environ.get('FLASK_DEBUG')
    JWT_ACCESS_TOKEN_EXPIRY = os.environ.get('JWT_ACCESS_TOKEN_EXPIRY')
    JWT_REFRESH_TOKEN_EXPIRY = os.environ.get('JWT_REFRESH_TOKEN_EXPIRY')

    DB_CONFIG = {
        'host': os.getenv('PG_HOST'),
        'port': os.getenv('PG_PORT'),
        'dbname': os.getenv('PG_DATABASE'),
        'user': os.getenv('PG_USER'),
        'password': os.getenv('PG_PASSWORD')
    }
    
    # Shopify API credentials
    SHOPIFY_API_KEY = os.environ.get('SHOPIFY_API_KEY')
    SHOPIFY_API_SECRET = os.environ.get('SHOPIFY_API_SECRET')
    SHOPIFY_STORE_URL = os.environ.get('SHOPIFY_STORE_URL')