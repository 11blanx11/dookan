# Dookan Assignment

A full stack e-commerce application built with React frontend and Python Flask backend.

## Features

- User authentication (login/signup)
- Product management with CRUD operations
- Real-time product data visualization
- Event logging for user actions
- Session management
- Responsive UI with dark/light mode

## Tech Stack

### Frontend
- React.js
- Purity UI Dashboard template
- Chakra UI components
- React Router for navigation
- Axios for API requests

### Backend
- Python Flask API
- MongoDB for product and user data storage
- PostgreSQL for event logging and session management
- Docker for containerization

## Prerequisites

- Git
- Node.js (v22.14.0)
- Python 3.8+
- Docker and Docker Compose
- MongoDB (local cluster)

## Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/11blanx11/dookan.git
cd dookan
```

### Setup PostgreSQL with Docker

Start the PostgreSQL container using Docker Compose:

```bash
docker-compose up -d
```

This will initialize and build the PostgreSQL container as defined in the docker-compose.yml file.

### Backend Setup

1. Create and activate a Python virtual environment:

```bash
python -m venv venv
# OR
python3 -m venv venv

# On macOS/Linux
source venv/bin/activate
```

2. Install the required Python packages:

```bash
pip install -r requirements.txt
```

3. Start the Flask server:

```bash
cd backend
python src/server.py
```

The backend server should now be running on http://localhost:5000.

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd purity-ui-dashboard
```

2. Ensure you're using the correct Node.js version:

```bash
# If using nvm
nvm install 22.14.0
nvm use 22.14.0
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

The frontend application should now be running on http://localhost:3000.

## Getting Started

### Initial User Setup

Before logging in, you must:

1. Ensure you have a MongoDB collection named `identifier_users` (it can be empty initially)
2. Navigate to the signup page and create a new user
3. Use the created credentials to log in

### Product Management

After successful login, you'll be redirected to the Tables page where you can:

- View all products from the `identifier_products` collection
- Add new products
- Edit existing products
- Delete products
- View product details

## Database Structure

### MongoDB Collections
- `identifier_users`: Stores user authentication information
- `identifier_products`: Stores product details

### PostgreSQL Tables
- `identifier_events`: Logs all CRUD operations performed by users
- `user_sessions`: Tracks user login sessions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
