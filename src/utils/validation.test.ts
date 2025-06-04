import { validateUserData } from './validation';
import { User } from '../types/user';

describe('validateUserData', () => {
  const validUser: Partial<User> = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    address: '123 Main St',
    birthDate: '1990-01-01',
    status: 'active',
  };

  it('validates a correct user object', () => {
    expect(validateUserData(validUser)).toBe(true);
  });

  it('validates required fields', () => {
    expect(validateUserData({ ...validUser, firstName: '' })).toBe(false);
    expect(validateUserData({ ...validUser, lastName: '' })).toBe(false);
    expect(validateUserData({ ...validUser, email: '' })).toBe(false);
  });

  it('validates email format', () => {
    expect(validateUserData({ ...validUser, email: 'invalid-email' })).toBe(false);
    expect(validateUserData({ ...validUser, email: 'invalid@' })).toBe(false);
    expect(validateUserData({ ...validUser, email: '@invalid.com' })).toBe(false);
    expect(validateUserData({ ...validUser, email: 'valid@email.com' })).toBe(true);
  });

  it('validates phone number format', () => {
    expect(validateUserData({ ...validUser, phoneNumber: '123' })).toBe(false);
    expect(validateUserData({ ...validUser, phoneNumber: 'abc1234567890' })).toBe(false);
    expect(validateUserData({ ...validUser, phoneNumber: '+1 (234) 567-8900' })).toBe(true);
    expect(validateUserData({ ...validUser, phoneNumber: undefined })).toBe(true);
  });

  it('validates birth date format', () => {
    expect(validateUserData({ ...validUser, birthDate: '01-01-1990' })).toBe(false);
    expect(validateUserData({ ...validUser, birthDate: '1990/01/01' })).toBe(false);
    expect(validateUserData({ ...validUser, birthDate: '1990-13-01' })).toBe(false);

    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    expect(validateUserData({ ...validUser, birthDate: '2025-12-01' })).toBe(false);
    jest.useRealTimers();

    expect(validateUserData({ ...validUser, birthDate: '1990-01-01' })).toBe(true);
    expect(validateUserData({ ...validUser, birthDate: undefined })).toBe(true);
  });

  it('validates status values', () => {
    expect(validateUserData({ ...validUser, status: 'invalid' as any })).toBe(false);
    expect(validateUserData({ ...validUser, status: 'active' })).toBe(true);
    expect(validateUserData({ ...validUser, status: 'inactive' })).toBe(true);
    expect(validateUserData({ ...validUser, status: undefined })).toBe(true);
  });
}); 