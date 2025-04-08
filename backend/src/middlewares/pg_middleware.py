from functools import wraps
from database_functions.pg_setup import get_db_connection


def log_to_pg(func):
    @wraps(func)
    def decorator(*args, **kwargs):
        print('Entered Pg decorator')
        return func(*args, **kwargs)
    return decorator