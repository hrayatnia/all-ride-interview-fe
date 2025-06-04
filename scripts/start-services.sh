#!/bin/bash

# Start backend services
cd ../allride
docker compose up -d

# Wait for backend services to be ready
echo "Waiting for backend services to start..."
sleep 10

# Start frontend services
cd ../all-ride-interview-fe
docker compose up -d

echo "All services are starting. You can access:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8080"
echo "- gRPC-Web (from backend): http://localhost:8090" 