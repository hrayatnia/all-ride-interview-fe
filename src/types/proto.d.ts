declare module '*/user_service_pb' {
  export class User {
    getId(): string;
    getFirstName(): string;
    getLastName(): string;
    getEmail(): string;
    getPhoneNumber(): string;
    getAddress(): string;
    getBirthDate(): string;
    getStatus(): string;
    toObject(): User.AsObject;
  }

  export namespace User {
    export interface AsObject {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      address: string;
      birthDate: string;
      status: string;
    }
  }

  export class ValidationError {
    getRow(): number;
    getErrorsList(): string[];
  }

  export class ValidateUserDataRequest {
    setFileContent(content: Uint8Array): void;
    setOriginalFileName(name: string): void;
  }

  export class ValidateUserDataResponse {
    getIsValid(): boolean;
    getErrorsList(): ValidationError[];
    getMessage(): string;
  }

  export class UploadUserDataRequest {
    setFileContent(content: Uint8Array): void;
    setOriginalFileName(name: string): void;
  }

  export class UploadUserDataResponse {
    getFileId(): string;
    getMessage(): string;
  }

  export class GetUserByIdRequest {
    setId(id: string): void;
  }

  export class GetUserByEmailRequest {
    setEmail(email: string): void;
  }

  export class GetUserResponse {
    getUser(): User | undefined;
  }

  export class GetAllUsersRequest {}

  export class GetAllUsersResponse {
    getUsersList(): User[];
  }
}

declare module '*/User_serviceServiceClientPb' {
  import {
    ValidateUserDataRequest,
    ValidateUserDataResponse,
    UploadUserDataRequest,
    UploadUserDataResponse,
    GetUserByIdRequest,
    GetUserResponse,
    GetUserByEmailRequest,
    GetAllUsersRequest,
    GetAllUsersResponse,
  } from '*/user_service_pb';

  export class UserServiceClient {
    constructor(hostname: string, credentials?: null, options?: null);

    validateUserData(
      request: ValidateUserDataRequest,
      metadata: object,
      callback: (error: Error | null, response: ValidateUserDataResponse) => void
    ): void;

    uploadUserData(
      request: UploadUserDataRequest,
      metadata: object,
      callback: (error: Error | null, response: UploadUserDataResponse) => void
    ): void;

    getUserById(
      request: GetUserByIdRequest,
      metadata: object,
      callback: (error: Error | null, response: GetUserResponse) => void
    ): void;

    getUserByEmail(
      request: GetUserByEmailRequest,
      metadata: object,
      callback: (error: Error | null, response: GetUserResponse) => void
    ): void;

    getAllUsers(
      request: GetAllUsersRequest,
      metadata: object,
      callback: (error: Error | null, response: GetAllUsersResponse) => void
    ): void;
  }
} 