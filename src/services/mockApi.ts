import { User, ImportResult } from '../types/user';
import { logger } from '../utils/logger';

const validateUser = (user: User): string[] => {
  const errors: string[] = [];

  if (!user.email?.includes('@')) {
    errors.push('Invalid email format');
  }
  if (!user.firstName?.trim()) {
    errors.push('First name is required');
  }
  if (!user.lastName?.trim()) {
    errors.push('Last name is required');
  }
  if (!user.phoneNumber?.trim()) {
    errors.push('Phone number is required');
  }
  if (!user.address?.trim()) {
    errors.push('Address is required');
  }
  if (!user.birthDate?.trim()) {
    errors.push('Birth date is required');
  }
  if (!['active', 'inactive'].includes(user.status)) {
    errors.push('Status must be either active or inactive');
  }

  return errors;
};

// Mock database
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    address: '123 Main St',
    birthDate: '1990-01-01',
    status: 'active'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '+0987654321',
    address: '456 Oak Ave',
    birthDate: '1992-03-15',
    status: 'active'
  }
];

export const mockUserApi = {
  validateUsers: async (users: User[]): Promise<ImportResult> => {
    logger.info('[Mock] Starting user validation', { userCount: users.length });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result: ImportResult = {
      successful: [],
      failed: [],
      totalProcessed: users.length,
    };

    users.forEach((user, index) => {
      const errors = validateUser(user);
      if (errors.length === 0) {
        result.successful.push(user);
      } else {
        logger.warn('[Mock] Validation errors found', { user, errors });
        result.failed.push({
          row: index + 1,
          errors,
        });
      }
    });

    logger.info('[Mock] Validation completed', {
      successCount: result.successful.length,
      failureCount: result.failed.length
    });

    return result;
  },

  importUsers: async (users: User[]): Promise<ImportResult> => {
    logger.info('[Mock] Starting user import', { userCount: users.length });
    
    // First validate the users
    const validationResult = await mockUserApi.validateUsers(users);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // If there are any validation errors, return them
    if (validationResult.failed.length > 0) {
      logger.warn('[Mock] Import canceled due to validation errors', {
        failureCount: validationResult.failed.length
      });
      return validationResult;
    }

    // Simulate successful import
    const result = {
      successful: users.map(user => ({
        ...user,
        id: Math.random().toString(36).substr(2, 9),
      })),
      failed: [],
      totalProcessed: users.length,
    };

    logger.info('[Mock] Import completed successfully', {
      successCount: result.successful.length
    });

    return result;
  },

  getAllUsers: async (): Promise<User[]> => {
    logger.info('[Mock] Fetching all users');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [...mockUsers];
  },

  getUserById: async (id: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  },

  getUserByEmail: async (email: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  }
}; 