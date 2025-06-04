#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Starting test setup verification..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if required ports are available
for port in 3000 8080 8090 9090 9901; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}❌ Port $port is already in use. Please free up this port.${NC}"
        exit 1
    fi
done

# Generate gRPC code
echo "Generating gRPC code..."
./scripts/generate-proto.sh

# Run frontend tests
echo "Running frontend tests..."
yarn test

# Build and start services
echo "Building and starting services..."
cd .. && docker compose build && docker compose up -d && cd all-ride-interview-fe

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 15

# Check if services are running
if docker compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Services are running successfully${NC}"
else
    echo -e "${RED}❌ Some services failed to start${NC}"
    docker compose logs
    exit 1
fi

# Health check endpoints
echo "Performing health checks..."

# Check Envoy proxy
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/health; then
    echo -e "${GREEN}✅ Envoy proxy is healthy${NC}"
else
    echo -e "${RED}❌ Envoy proxy health check failed${NC}"
fi

# Check Frontend (retry a few times)
max_retries=5
retry_count=0
while [ $retry_count -lt $max_retries ]; do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/; then
        echo -e "${GREEN}✅ Frontend is accessible${NC}"
        break
    else
        retry_count=$((retry_count + 1))
        if [ $retry_count -eq $max_retries ]; then
            echo -e "${RED}❌ Frontend health check failed after $max_retries attempts${NC}"
        else
            echo "Waiting for frontend to start (attempt $retry_count/$max_retries)..."
            sleep 5
        fi
    fi
done

# Check Backend (through Envoy)
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/health; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
fi

echo -e "${GREEN}✅ Setup verification completed${NC}" 