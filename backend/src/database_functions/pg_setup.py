# src/database.py
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from functools import wraps
from contextlib import contextmanager

# Load environment variables
load_dotenv()

# Database configuration
DB_CONFIG = {
    'dbname': os.getenv('PG_DOOKAN_DATABASE'),
    'user': os.getenv('PG_USER'),
    'password': os.getenv('PG_PASSWORD'),
    'host': os.getenv('PG_HOST'),
    'port': os.getenv('PG_PORT')
}

print(f'DB_CONFIG: {str(DB_CONFIG)}')

@contextmanager # so that I can use with get_db_connectio similar to with connection as conn
def get_db_connection():
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        yield conn
    except Exception as e:
        print(f'Failed to connect to pg due to {str(e)}')
    finally:
        if conn is not None:
            conn.close()

def init_db():
    # Create identifier_events table
    identifier_events = """
    CREATE TABLE IF NOT EXISTS identifier_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('CREATE', 'UPDATE', 'DELETE')),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id VARCHAR(255) NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """

    user_sessions = """
    CREATE TABLE IF NOT EXISTS user_sessions(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255) NOT NULL,
        session_token TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
    );  
    """
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(identifier_events)
            cur.execute(user_sessions)
            
            # Building a trigger-function setup to autoupdate updated timestamp
            # The update function
            cur.execute("""
                CREATE OR REPLACE FUNCTION update_timestamp()
                RETURNS TRIGGER AS $$
                BEGIN
                    NEW.updated_at = NOW();
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            """)
            
            # Creating the trigger for updating events table timestamp
            cur.execute("""
                DROP TRIGGER IF EXISTS update_events_timestamp ON identifier_events;
                CREATE TRIGGER update_events_timestamp
                BEFORE UPDATE ON identifier_events
                FOR EACH ROW
                EXECUTE FUNCTION update_timestamp();
            """)
            
        conn.commit()
