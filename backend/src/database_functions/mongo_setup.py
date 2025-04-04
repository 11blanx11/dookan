from pymongo import MongoClient
from config import Config

# Client Collection
client = MongoClient(Config.MONGODB_URI)
dookan_db = client['dookan']

# Collections being used
products_collection = dookan_db['identifier_products']
users_collection = dookan_db['identifier_users']
