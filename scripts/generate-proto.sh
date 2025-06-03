#!/bin/bash

# Create the generated directory if it doesn't exist
mkdir -p src/generated

# Generate JavaScript code
protoc \
    --proto_path=src/proto \
    --js_out=import_style=commonjs:src/generated \
    --grpc-web_out=import_style=typescript,mode=grpcwebtext:src/generated \
    src/proto/user_service.proto

# Copy Google proto files if needed
if [ -d "src/proto/google" ]; then
  cp -r src/proto/google src/generated/
fi

# Create index.ts file
echo "// Generated index file" > src/generated/index.ts

# Fix imports in generated files
for f in src/generated/*_pb.js; do
    if [ -f "$f" ]; then
        base_name=$(basename "$f" .js)
        mv -- "$f" "src/generated/${base_name}.ts"
        echo "export * from './${base_name}';" >> src/generated/index.ts
    fi
done

for f in src/generated/*_grpc_web_pb.js; do
    if [ -f "$f" ]; then
        base_name=$(basename "$f" .js)
        mv -- "$f" "src/generated/${base_name}.ts"
        echo "export * from './${base_name}';" >> src/generated/index.ts
    fi
done

echo "✅ gRPC code generation completed" 