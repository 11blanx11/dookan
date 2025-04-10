# src/server.py

from flask import Flask
from flask_cors import CORS
from routes import register_routes
from config import Config



def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # # Initialize extensions
    CORS(app,
        origins=["http://localhost:3000"],
        methods=["GET", "POST", "PUT", "OPTIONS", "DELETE"],
        supports_credentials=True,
        expose_headers=["Authorization", "Content-Type"],
        allow_headers=["Authorization", "Content-Type"])

    # Setting up blueprints for routing
    register_routes(app)
    return app

app = create_app()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug = Config.DEBUG)
