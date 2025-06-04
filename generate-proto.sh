#!/bin/bash

# Create proto output directory if it doesn't exist
mkdir -p src/generated

# Clean up any existing generated files
rm -f src/generated/*_pb.js src/generated/*_pb.d.ts src/generated/*_pb_service.js src/generated/*_pb_service.d.ts

# Generate JavaScript code and gRPC-Web code
protoc \
  --plugin=protoc-gen-grpc-web=./node_modules/.bin/protoc-gen-grpc-web \
  --js_out=import_style=commonjs,binary:src/generated \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:src/generated \
  -I src/proto \
  -I ./node_modules/google-protobuf/google/protobuf \
  src/proto/user_service.proto

# Create an index.ts file to re-export everything
echo "export * from './user_service_pb';" > src/generated/index.ts

echo "Proto files generated successfully!" 