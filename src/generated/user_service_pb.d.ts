import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class User extends jspb.Message {
  getId(): string;
  setId(value: string): User;

  getFirstName(): string;
  setFirstName(value: string): User;

  getLastName(): string;
  setLastName(value: string): User;

  getEmail(): string;
  setEmail(value: string): User;

  getPhoneNumber(): string;
  setPhoneNumber(value: string): User;

  getAddress(): string;
  setAddress(value: string): User;

  getBirthDate(): string;
  setBirthDate(value: string): User;

  getStatus(): string;
  setStatus(value: string): User;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): User;
  hasCreatedAt(): boolean;
  clearCreatedAt(): User;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): User.AsObject;
  static toObject(includeInstance: boolean, msg: User): User.AsObject;
  static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): User;
  static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
  export type AsObject = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    address: string,
    birthDate: string,
    status: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class ValidationError extends jspb.Message {
  getRow(): number;
  setRow(value: number): ValidationError;

  getErrorsList(): Array<string>;
  setErrorsList(value: Array<string>): ValidationError;
  clearErrorsList(): ValidationError;
  addErrors(value: string, index?: number): ValidationError;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidationError.AsObject;
  static toObject(includeInstance: boolean, msg: ValidationError): ValidationError.AsObject;
  static serializeBinaryToWriter(message: ValidationError, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidationError;
  static deserializeBinaryFromReader(message: ValidationError, reader: jspb.BinaryReader): ValidationError;
}

export namespace ValidationError {
  export type AsObject = {
    row: number,
    errorsList: Array<string>,
  }
}

export class ValidateUserDataRequest extends jspb.Message {
  getFileContent(): Uint8Array | string;
  getFileContent_asU8(): Uint8Array;
  getFileContent_asB64(): string;
  setFileContent(value: Uint8Array | string): ValidateUserDataRequest;

  getOriginalFileName(): string;
  setOriginalFileName(value: string): ValidateUserDataRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateUserDataRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateUserDataRequest): ValidateUserDataRequest.AsObject;
  static serializeBinaryToWriter(message: ValidateUserDataRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateUserDataRequest;
  static deserializeBinaryFromReader(message: ValidateUserDataRequest, reader: jspb.BinaryReader): ValidateUserDataRequest;
}

export namespace ValidateUserDataRequest {
  export type AsObject = {
    fileContent: Uint8Array | string,
    originalFileName: string,
  }
}

export class ValidateUserDataResponse extends jspb.Message {
  getErrorsList(): Array<ValidationError>;
  setErrorsList(value: Array<ValidationError>): ValidateUserDataResponse;
  clearErrorsList(): ValidateUserDataResponse;
  addErrors(value?: ValidationError, index?: number): ValidationError;

  getIsValid(): boolean;
  setIsValid(value: boolean): ValidateUserDataResponse;

  getMessage(): string;
  setMessage(value: string): ValidateUserDataResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateUserDataResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateUserDataResponse): ValidateUserDataResponse.AsObject;
  static serializeBinaryToWriter(message: ValidateUserDataResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateUserDataResponse;
  static deserializeBinaryFromReader(message: ValidateUserDataResponse, reader: jspb.BinaryReader): ValidateUserDataResponse;
}

export namespace ValidateUserDataResponse {
  export type AsObject = {
    errorsList: Array<ValidationError.AsObject>,
    isValid: boolean,
    message: string,
  }
}

export class UploadUserDataRequest extends jspb.Message {
  getFileContent(): Uint8Array | string;
  getFileContent_asU8(): Uint8Array;
  getFileContent_asB64(): string;
  setFileContent(value: Uint8Array | string): UploadUserDataRequest;

  getOriginalFileName(): string;
  setOriginalFileName(value: string): UploadUserDataRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UploadUserDataRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UploadUserDataRequest): UploadUserDataRequest.AsObject;
  static serializeBinaryToWriter(message: UploadUserDataRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UploadUserDataRequest;
  static deserializeBinaryFromReader(message: UploadUserDataRequest, reader: jspb.BinaryReader): UploadUserDataRequest;
}

export namespace UploadUserDataRequest {
  export type AsObject = {
    fileContent: Uint8Array | string,
    originalFileName: string,
  }
}

export class UploadUserDataResponse extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): UploadUserDataResponse;

  getFileId(): string;
  setFileId(value: string): UploadUserDataResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UploadUserDataResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UploadUserDataResponse): UploadUserDataResponse.AsObject;
  static serializeBinaryToWriter(message: UploadUserDataResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UploadUserDataResponse;
  static deserializeBinaryFromReader(message: UploadUserDataResponse, reader: jspb.BinaryReader): UploadUserDataResponse;
}

export namespace UploadUserDataResponse {
  export type AsObject = {
    message: string,
    fileId: string,
  }
}

export class GetUserByIdRequest extends jspb.Message {
  getId(): string;
  setId(value: string): GetUserByIdRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserByIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserByIdRequest): GetUserByIdRequest.AsObject;
  static serializeBinaryToWriter(message: GetUserByIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserByIdRequest;
  static deserializeBinaryFromReader(message: GetUserByIdRequest, reader: jspb.BinaryReader): GetUserByIdRequest;
}

export namespace GetUserByIdRequest {
  export type AsObject = {
    id: string,
  }
}

export class GetUserByEmailRequest extends jspb.Message {
  getEmail(): string;
  setEmail(value: string): GetUserByEmailRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserByEmailRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserByEmailRequest): GetUserByEmailRequest.AsObject;
  static serializeBinaryToWriter(message: GetUserByEmailRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserByEmailRequest;
  static deserializeBinaryFromReader(message: GetUserByEmailRequest, reader: jspb.BinaryReader): GetUserByEmailRequest;
}

export namespace GetUserByEmailRequest {
  export type AsObject = {
    email: string,
  }
}

export class GetUserResponse extends jspb.Message {
  getUser(): User | undefined;
  setUser(value?: User): GetUserResponse;
  hasUser(): boolean;
  clearUser(): GetUserResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserResponse): GetUserResponse.AsObject;
  static serializeBinaryToWriter(message: GetUserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserResponse;
  static deserializeBinaryFromReader(message: GetUserResponse, reader: jspb.BinaryReader): GetUserResponse;
}

export namespace GetUserResponse {
  export type AsObject = {
    user?: User.AsObject,
  }
}

export class GetAllUsersRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllUsersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllUsersRequest): GetAllUsersRequest.AsObject;
  static serializeBinaryToWriter(message: GetAllUsersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllUsersRequest;
  static deserializeBinaryFromReader(message: GetAllUsersRequest, reader: jspb.BinaryReader): GetAllUsersRequest;
}

export namespace GetAllUsersRequest {
  export type AsObject = {
  }
}

export class GetAllUsersResponse extends jspb.Message {
  getUsersList(): Array<User>;
  setUsersList(value: Array<User>): GetAllUsersResponse;
  clearUsersList(): GetAllUsersResponse;
  addUsers(value?: User, index?: number): User;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllUsersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllUsersResponse): GetAllUsersResponse.AsObject;
  static serializeBinaryToWriter(message: GetAllUsersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllUsersResponse;
  static deserializeBinaryFromReader(message: GetAllUsersResponse, reader: jspb.BinaryReader): GetAllUsersResponse;
}

export namespace GetAllUsersResponse {
  export type AsObject = {
    usersList: Array<User.AsObject>,
  }
}

