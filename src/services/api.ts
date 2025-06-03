import { User, ImportResult } from '../types/user';
import { config } from '../config/env';
import { mockUserApi } from './mockApi';
import { userService } from './userService';
import { logger } from '../utils/logger';
import { UserServiceClient } from '../generated/User_serviceServiceClientPb';
import type { LogData } from '../utils/logger';

// Import proto types
// eslint-disable-next-line @typescript-eslint/no-var-requires
const proto = require('../generated/user_service_pb');

// Create a gRPC-Web client instance
const client = new UserServiceClient('http://localhost:8080');

// Error handling for gRPC errors
const handleGrpcError = (error: unknown): string => {
  // gRPC error codes: https://grpc.github.io/grpc/core/md_doc_statuscodes.html
  const grpcError = error as { code?: number };
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

export const userApi = {
  importUsers: async (users: User[]): Promise<ImportResult> => {
    logger.info('Starting user import process', { userCount: users.length });

    if (config.isDevelopment || config.enableMockApi) {
      logger.debug('Using mock API for import');
      return mockUserApi.importUsers(users);
    }

    try {
      logger.debug('Converting users to CSV format');
      // Convert users array to CSV format
      const csvContent = users.map(user => 
        `${user.firstName},${user.lastName},${user.email},${user.phoneNumber},${user.address},${user.birthDate},${user.status}`
      ).join('\n');
      
      // Add header row
      const csvWithHeader = `firstName,lastName,email,phoneNumber,address,birthDate,status\n${csvContent}`;
      
      logger.debug('Converting CSV content to Uint8Array');
      // Convert string to Uint8Array
      const encoder = new TextEncoder();
      const fileContent = encoder.encode(csvWithHeader);
      
      logger.info('Uploading user data via gRPC');
      // Upload using gRPC service
      const fileId = await userService.uploadUserData(fileContent, 'users.csv');
      logger.info('Upload successful', { fileId });
      
      // Since we don't get detailed import results from gRPC, we'll assume success
      return {
        successful: users,
        failed: [],
        totalProcessed: users.length
      };
    } catch (error) {
      logger.error('Failed to import users', { error: error as LogData });
      throw new Error(handleGrpcError(error));
    }
  },
  
  validateUsers: async (users: User[]): Promise<ImportResult> => {
    logger.info('Starting user validation process', { userCount: users.length });

    if (config.isDevelopment || config.enableMockApi) {
      logger.debug('Using mock API for validation');
      return mockUserApi.validateUsers(users);
    }

    try {
      logger.debug('Converting users to CSV format for validation');
      // Convert users array to CSV format
      const csvContent = users.map(user => 
        `${user.firstName},${user.lastName},${user.email},${user.phoneNumber},${user.address},${user.birthDate},${user.status}`
      ).join('\n');
      
      // Add header row
      const csvWithHeader = `firstName,lastName,email,phoneNumber,address,birthDate,status\n${csvContent}`;
      
      logger.debug('Converting CSV content to Uint8Array');
      // Convert string to Uint8Array
      const encoder = new TextEncoder();
      const fileContent = encoder.encode(csvWithHeader);
      
      logger.info('Validating user data via gRPC');
      // Validate using gRPC service
      const response = await userService.validateUserData(fileContent, 'users.csv');
      logger.info('Validation response received', { 
        isValid: response.getIsValid(),
        errorCount: response.getErrorsList().length 
      });
      
      const validationErrors = response.getErrorsList();
      
      return {
        successful: validationErrors.length === 0 ? users : users.filter((_, index) => 
          !validationErrors.some((validationError: typeof proto.ValidationError) => validationError.getRow() === index + 1)
        ),
        failed: validationErrors.map((validationError: typeof proto.ValidationError) => ({
          row: validationError.getRow(),
          errors: validationError.getErrorsList()
        })),
        totalProcessed: users.length
      };
    } catch (error) {
      logger.error('Failed to validate users', { error: error as LogData });
      throw new Error(handleGrpcError(error));
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    if (config.isDevelopment || config.enableMockApi) {
      return mockUserApi.getAllUsers();
    }

    try {
      const users = await userService.getAllUsers();
      return users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: '', // These fields are not in the gRPC response
        address: '',    // You might want to extend your proto definition
        birthDate: '',  // to include these fields
        status: 'active' as const
      }));
    } catch (error) {
      logger.error('Failed to get users', { error: error as LogData });
      throw new Error(handleGrpcError(error));
    }
  },

  getUserById: async (id: string): Promise<User> => {
    if (config.isDevelopment || config.enableMockApi) {
      return mockUserApi.getUserById(id);
    }

    try {
      const user = await userService.getUserById(id);
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: '', // These fields are not in the gRPC response
        address: '',    // You might want to extend your proto definition
        birthDate: '',  // to include these fields
        status: 'active' as const
      };
    } catch (error) {
      logger.error('Failed to get user', { error: error as LogData, userId: id });
      throw new Error(handleGrpcError(error));
    }
  },

  getUserByEmail: async (email: string): Promise<User> => {
    if (config.isDevelopment || config.enableMockApi) {
      return mockUserApi.getUserByEmail(email);
    }

    try {
      const user = await userService.getUserByEmail(email);
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: '', // These fields are not in the gRPC response
        address: '',    // You might want to extend your proto definition
        birthDate: '',  // to include these fields
        status: 'active' as const
      } as User;
    } catch (error) {
      throw new Error(handleGrpcError(error));
    }
  }
};

// API functions
export const uploadUserData = async (file: File): Promise<string> => {
  try {
    const request = new proto.UploadUserDataRequest();
    request.setOriginalFileName(file.name);
    
    const fileContent = await file.arrayBuffer();
    request.setFileContent(new Uint8Array(fileContent));
    
    return new Promise((resolve, reject) => {
      client.uploadUserData(request, {}, (error, response) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response.getFileId());
      });
    });
  } catch (error) {
    logger.error('Failed to upload user data', { error: error as LogData });
    throw new Error(handleGrpcError(error));
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const request = new proto.GetAllUsersRequest();
    const response = await client.getAllUsers(request, {});
    const users = response.getUsersList().map((user: typeof proto.User) => user.toObject());
    logger.info('Retrieved all users', { count: users.length });
    return users;
  } catch (error) {
    logger.error('Failed to get users', { error: error as LogData });
    throw new Error(handleGrpcError(error));
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const request = new proto.GetUserByIdRequest();
    request.setId(id);
    
    const response = await client.getUserById(request, {});
    const user = response.getUser()?.toObject();
    if (!user) {
      throw new Error('User not found');
    }
    logger.info('Retrieved user by ID', { userId: id });
    return user;
  } catch (error) {
    logger.error('Failed to get user', { error: error as LogData, userId: id });
    throw new Error(handleGrpcError(error));
  }
}; 