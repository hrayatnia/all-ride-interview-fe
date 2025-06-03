import { UserServiceClient } from '../generated/User_serviceServiceClientPb';
import { RpcError, StatusCode } from 'grpc-web';
import { logger } from '../utils/logger';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const proto = require('../generated/user_service_pb');

type GrpcError = RpcError;

declare module '../generated/User_serviceServiceClientPb' {
  interface UserServiceClient {
    validateUserData(
      request: typeof proto.ValidateUserDataRequest,
      metadata: object,
      callback: (error: GrpcError | null, response: typeof proto.ValidateUserDataResponse) => void
    ): void;
  }
}

class UserService {
  private client: UserServiceClient;

  constructor() {
    // The URL should match the backend's Envoy proxy
    this.client = new UserServiceClient('http://localhost:8090');
  }

  async validateUserData(fileContent: Uint8Array, fileName: string): Promise<typeof proto.ValidateUserDataResponse> {
    const request = new proto.ValidateUserDataRequest();
    request.setFileContent(fileContent);
    request.setOriginalFileName(fileName);

    logger.debug('Sending validation request', { fileName });

    return new Promise((resolve, reject) => {
      this.client.validateUserData(
        request,
        {},
        (err: GrpcError | null, response: typeof proto.ValidateUserDataResponse) => {
          if (err) {
            logger.error('Validation request failed', { error: err });
            reject(err);
            return;
          }
          logger.info('Validation completed', {
            isValid: response.getIsValid(),
            errorCount: response.getErrorsList().length
          });
          resolve(response);
        }
      );
    });
  }

  async uploadUserData(fileContent: Uint8Array, fileName: string): Promise<string> {
    const request = new proto.UploadUserDataRequest();
    request.setFileContent(fileContent);
    request.setOriginalFileName(fileName);

    logger.debug('Sending upload request', { fileName });

    return new Promise((resolve, reject) => {
      this.client.uploadUserData(
        request,
        {},
        (err: GrpcError | null, response: typeof proto.UploadUserDataResponse) => {
          if (err) {
            logger.error('Upload request failed', { error: err });
            reject(err);
            return;
          }
          logger.info('Upload completed', { fileId: response.getFileId() });
          resolve(response.getFileId());
        }
      );
    });
  }

  async getUserById(id: string): Promise<typeof proto.User.AsObject> {
    const request = new proto.GetUserByIdRequest();
    request.setId(id);

    logger.debug('Fetching user by ID', { userId: id });

    return new Promise((resolve, reject) => {
      this.client.getUserById(
        request,
        {},
        (err: GrpcError | null, response: typeof proto.GetUserResponse) => {
          if (err) {
            logger.error('Failed to get user by ID', { error: err, userId: id });
            reject(err);
            return;
          }
          const user = response.getUser()?.toObject();
          if (!user) {
            reject(new RpcError(StatusCode.NOT_FOUND, 'User not found', {}));
            return;
          }
          logger.info('Retrieved user by ID', { userId: id });
          resolve(user);
        }
      );
    });
  }

  async getUserByEmail(email: string): Promise<typeof proto.User.AsObject> {
    const request = new proto.GetUserByEmailRequest();
    request.setEmail(email);

    logger.debug('Fetching user by email', { email });

    return new Promise((resolve, reject) => {
      this.client.getUserByEmail(
        request,
        {},
        (err: GrpcError | null, response: typeof proto.GetUserResponse) => {
          if (err) {
            logger.error('Failed to get user by email', { error: err, email });
            reject(err);
            return;
          }
          const user = response.getUser()?.toObject();
          if (!user) {
            reject(new RpcError(StatusCode.NOT_FOUND, 'User not found', {}));
            return;
          }
          logger.info('Retrieved user by email', { email });
          resolve(user);
        }
      );
    });
  }

  async getAllUsers(): Promise<typeof proto.User.AsObject[]> {
    const request = new proto.GetAllUsersRequest();

    logger.debug('Fetching all users');

    return new Promise((resolve, reject) => {
      this.client.getAllUsers(
        request,
        {},
        (err: GrpcError | null, response: typeof proto.GetAllUsersResponse) => {
          if (err) {
            logger.error('Failed to get all users', { error: err });
            reject(err);
            return;
          }
          const users = response.getUsersList().map((user: typeof proto.User) => user.toObject());
          logger.info('Retrieved all users', { count: users.length });
          resolve(users);
        }
      );
    });
  }
}

export const userService = new UserService(); 