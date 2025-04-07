FROM postgres:latest

# Environment variables will be provided via docker-compose.yml
# Copy SQL initialization scripts
COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432