import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { UserResponse, User } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: {
  street?: string;
  state?: string;
  city?: string;
  zipcode?: string;
}): string {
  const parts = [
    address.street,
    address.state,
    address.city,
    address.zipcode,
  ].filter(Boolean);

  return parts.join(', ') || 'No address';
}

export function mapUserResponseToUser(user: UserResponse): User {
  const address =
    user.street || user.city || user.zipcode
      ? {
          street: user.street || '',
          city: user.city || '',
          zipcode: user.zipcode || '',
          state: user.state,
        }
      : undefined;

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    address,
  };
}
