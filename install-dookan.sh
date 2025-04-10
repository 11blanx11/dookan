#!/bin/bash
echo "Starting Dookan installation..."

# Clone repository
echo "Cloning repository..."
git clone https://github.com/11blanx11/dookan.git
cd dookan

# Building .env
echo "Setting up .env file"
cp .env.template .env
echo "Created .env file. Please edit it with your database details if needed."

# Start PostgreSQL with Docker
echo "Starting PostgreSQL container..."
docker-compose up -d

# Setup backend
echo "Setting up backend..."
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup frontend
echo "Setting up frontend..."
cd purity-ui-dashboard
npm install
cd ..

echo "Installation complete!"
echo "To start the backend: cd backend && python src/server.py"
echo "To start the frontend: cd purity-ui-dashboard && npm start"
echo "Backend will run on http://localhost:5000"
echo "Frontend will run on http://localhost:3000"