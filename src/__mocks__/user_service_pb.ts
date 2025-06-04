export class User {
  getId = () => '1';
  getFirstName = () => 'John';
  getLastName = () => 'Doe';
  getEmail = () => 'john.doe@example.com';
  getPhoneNumber = () => '+1234567890';
  getAddress = () => '123 Main St';
  getBirthDate = () => '1990-01-01';
  getStatus = () => 'active';
  toObject = () => ({
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    address: '123 Main St',
    birthDate: '1990-01-01',
    status: 'active'
  });
}

export class ValidationError {
  getRow = () => 1;
  getErrorsList = () => ['Test error'];
}

export class ValidateUserDataRequest {
  setFileContent = jest.fn();
  setOriginalFileName = jest.fn();
}

export class ValidateUserDataResponse {
  getIsValid = () => true;
  getErrorsList = () => [];
  getMessage = () => 'Success';
}

export class UploadUserDataRequest {
  setFileContent = jest.fn();
  setOriginalFileName = jest.fn();
}

export class UploadUserDataResponse {
  getFileId = () => '123';
  getMessage = () => 'Success';
}

export class GetUserByIdRequest {
  setId = jest.fn();
}

export class GetUserByEmailRequest {
  setEmail = jest.fn();
}

export class GetUserResponse {
  getUser = () => new User();
}

export class GetAllUsersRequest {}

export class GetAllUsersResponse {
  getUsersList = () => [new User()];
} 