export class UserServiceClient {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(hostname: string) {
    // Mock constructor
  }

  validateUserData = jest.fn().mockImplementation((request, metadata, callback) => {
    callback(null, {
      getIsValid: () => true,
      getErrorsList: () => [],
      getMessage: () => 'Success'
    });
  });

  uploadUserData = jest.fn().mockImplementation((request, metadata, callback) => {
    callback(null, {
      getFileId: () => '123',
      getMessage: () => 'Success'
    });
  });

  getUserById = jest.fn().mockImplementation((request, metadata, callback) => {
    callback(null, {
      getUser: () => ({
        getId: () => '1',
        getFirstName: () => 'John',
        getLastName: () => 'Doe',
        getEmail: () => 'john.doe@example.com',
        getPhoneNumber: () => '+1234567890',
        getAddress: () => '123 Main St',
        getBirthDate: () => '1990-01-01',
        getStatus: () => 'active',
        toObject: () => ({
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phoneNumber: '+1234567890',
          address: '123 Main St',
          birthDate: '1990-01-01',
          status: 'active'
        })
      })
    });
  });

  getUserByEmail = jest.fn().mockImplementation((request, metadata, callback) => {
    callback(null, {
      getUser: () => ({
        getId: () => '1',
        getFirstName: () => 'John',
        getLastName: () => 'Doe',
        getEmail: () => 'john.doe@example.com',
        getPhoneNumber: () => '+1234567890',
        getAddress: () => '123 Main St',
        getBirthDate: () => '1990-01-01',
        getStatus: () => 'active',
        toObject: () => ({
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phoneNumber: '+1234567890',
          address: '123 Main St',
          birthDate: '1990-01-01',
          status: 'active'
        })
      })
    });
  });

  getAllUsers = jest.fn().mockImplementation((request, metadata, callback) => {
    callback(null, {
      getUsersList: () => [{
        getId: () => '1',
        getFirstName: () => 'John',
        getLastName: () => 'Doe',
        getEmail: () => 'john.doe@example.com',
        getPhoneNumber: () => '+1234567890',
        getAddress: () => '123 Main St',
        getBirthDate: () => '1990-01-01',
        getStatus: () => 'active',
        toObject: () => ({
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phoneNumber: '+1234567890',
          address: '123 Main St',
          birthDate: '1990-01-01',
          status: 'active'
        })
      }]
    });
  });
} 