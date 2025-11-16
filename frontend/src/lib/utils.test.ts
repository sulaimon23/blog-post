import { describe, it, expect } from 'vitest';
import { formatAddress, mapUserResponseToUser } from './utils';
import type { UserResponse, User } from '@/types';

describe('formatAddress', () => {
  it('should format a complete address correctly', () => {
    const address = {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipcode: '10001',
    };
    expect(formatAddress(address)).toBe('123 Main St, NY, New York, 10001');
  });

  it('should format an address with missing fields', () => {
    const address = {
      street: '123 Main St',
      city: 'New York',
    };
    expect(formatAddress(address)).toBe('123 Main St, New York');
  });

  it('should handle address with only city', () => {
    const address = {
      city: 'New York',
    };
    expect(formatAddress(address)).toBe('New York');
  });

  it('should return "No address" for empty address', () => {
    const address = {};
    expect(formatAddress(address)).toBe('No address');
  });

  it('should filter out undefined and null values', () => {
    const address = {
      street: '123 Main St',
      state: undefined,
      city: 'New York',
      zipcode: '',
    };
    expect(formatAddress(address)).toBe('123 Main St, New York');
  });
});

describe('mapUserResponseToUser', () => {
  it('should map a complete UserResponse to User correctly', () => {
    const userResponse: UserResponse = {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phone: '123-456-7890',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipcode: '10001',
    };

    const expectedUser: User = {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phone: '123-456-7890',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipcode: '10001',
      },
    };

    expect(mapUserResponseToUser(userResponse)).toEqual(expectedUser);
  });

  it('should map UserResponse with partial address', () => {
    const userResponse: UserResponse = {
      id: '2',
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane@example.com',
      phone: '987-654-3210',
      street: '456 Oak Ave',
      city: 'Los Angeles',
      zipcode: '90001',
    };

    const result = mapUserResponseToUser(userResponse);
    expect(result.address).toEqual({
      street: '456 Oak Ave',
      city: 'Los Angeles',
      zipcode: '90001',
      state: undefined,
    });
  });

  it('should set address to undefined when no address fields are present', () => {
    const userResponse: UserResponse = {
      id: '3',
      name: 'Bob Johnson',
      username: 'bobjohnson',
      email: 'bob@example.com',
      phone: '555-123-4567',
    };

    const result = mapUserResponseToUser(userResponse);
    expect(result.address).toBeUndefined();
  });

  it('should handle empty string address fields', () => {
    const userResponse: UserResponse = {
      id: '4',
      name: 'Alice Brown',
      username: 'alicebrown',
      email: 'alice@example.com',
      phone: '555-987-6543',
      street: '',
      city: '',
      zipcode: '',
    };

    const result = mapUserResponseToUser(userResponse);
    expect(result.address).toBeUndefined();
  });

  it('should preserve all non-address fields correctly', () => {
    const userResponse: UserResponse = {
      id: '5',
      name: 'Charlie Wilson',
      username: 'charliewilson',
      email: 'charlie@example.com',
      phone: '555-111-2222',
    };

    const result = mapUserResponseToUser(userResponse);
    expect(result.id).toBe('5');
    expect(result.name).toBe('Charlie Wilson');
    expect(result.username).toBe('charliewilson');
    expect(result.email).toBe('charlie@example.com');
    expect(result.phone).toBe('555-111-2222');
  });
});

