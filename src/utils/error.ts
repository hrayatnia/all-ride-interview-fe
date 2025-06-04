import { RpcError } from 'grpc-web';

export const handleGrpcError = (error: unknown): string => {
  // gRPC error codes: https://grpc.github.io/grpc/core/md_doc_statuscodes.html
  const grpcError = error as RpcError;
  if (grpcError.code) {
    switch (grpcError.code) {
      case 5:
        return 'Not found';
      case 13:
        return 'Internal server error';
      default:
        return `gRPC error: ${grpcError.code}`;
    }
  }
  return 'Unknown error';
}; 