# src/database_functions/product.py
from .mongo_setup import products_collection
from bson import ObjectId

def get_all_products():
    print('Entered Get all products')
    pipeline = [
        {
            "$match":
            {
                "Title": {
                "$exists": True
                }
            }
        },
        {
            "$project":
            {
                "_id": {
                "$toString": "$_id"
                },
                "Handle": "$Handle",
                "Title": "$Title",
                "Vendor": "$Vendor",
                "Tags": "$Tags",
                "SKU": "$SKU",
                "Shop location": "$Shop location",
                "Variant Price": "$Variant Price",
                "Image Src": "$Image Src"
            }
        }
        ]
    products = list(products_collection.aggregate(pipeline))
    for product in products:
        product['_id'] = str(product['_id'])
    return products

def get_product_by_id(product_id):
    try:
        product = products_collection.find_one({"_id": ObjectId(product_id)})
        if product:
            product['_id'] = str(product['_id'])
        return product
    except:
        return None

def create_product(product_data):
    try:
        result = products_collection.insert_one(product_data)
        return True,str(result.inserted_id)
    except Exception as e:
        return False, str(e)
    

def update_product(product_id, product_data):
    try:
        result = products_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": product_data}
        )
        return  True, result.modified_count > 0
    except Exception as e:
        return False, str(e)

def delete_product(product_id):
    try:
        result = products_collection.delete_one({"_id": ObjectId(product_id)})
        return True, result.deleted_count > 0
    except Exception as e:
        return False, str(e)