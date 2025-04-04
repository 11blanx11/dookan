from routes.user_routes import user_auth_bp
from routes.product_routes import product_bp

def register_routes(app):
    app.register_blueprint(user_auth_bp, url_prefix='/api/v1/users')
    app.register_blueprint(product_bp, url_prefix='/api/products')