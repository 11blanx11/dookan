# src/database_functions/product.py
from .mongo_setup import products_collection
from .pg_setup import get_db_connection
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
                "Variant SKU": "$Variant SKU",
                "Shop location": "$Shop location",
                "Variant Price": "$Variant Price",
                "Image Src": "$Image Src"
            }
        }
        ]
    # products = list(products_collection.aggregate(pipeline))
    products = list(products_collection.find({}))
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
        products = list(products_collection.find({
            "$or":[
            {"Handle":product_data.get("Handle")},
            {"Variant SKU":product_data.get("Variant SKU")}]
            }))
        if not len(products) == 0 :
            # Product Already Exists
            return False, 'Product Already Exists'
        if "_id" in product_data:
            product_data.pop("_id")
        result = products_collection.insert_one(product_data)
        return True,str(result.inserted_id)
    except Exception as e:
        return False, str(e)

def update_product(product_id, product_data):
    try:
        # Check if a product with same Handle but different SKU exists
        duplicate_check = products_collection.find_one({
            "Handle": product_data.get("Handle"),
            "Variant SKU": {"$ne": product_data.get("Variant SKU")}
        })

        if duplicate_check:
            return False, 'Cannot Change to an Existing Product'

        # Remove _id from product_data if it exists
        if "_id" in product_data:
            product_data.pop("_id")

        # Update the product
        result = products_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": product_data}
        )

        success = result.modified_count > 0
        message = "Product updated successfully" if success else "No changes made"
        return True, message

    except Exception as e:
        print('Raised Exception')
        return False, f"Error updating product: {str(e)}"

def delete_product(product_id):
    try:
        result = products_collection.delete_one({"_id": ObjectId(product_id)})
        return True, result.deleted_count
    except Exception as e:
        return False, str(e)


def log_into_pg(user_id, product_id, state):
    state = state.upper();
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                query = f"""
                INSERT INTO user_event_logs (user_id, product_id, event_status) VALUES ('{user_id}','{product_id}','{state}');
                """
                print(f'state update Query: {query}')
                cur.execute(query)
                conn.commit()
        return True, 'Successfully Updated'
    except Exception as e:
        return False, str(e)
