export interface Address {
  street: string;
  suite?: string;
  city: string;
  zipcode: string;
  state?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  address?: Address;
}

export interface UserResponse {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  body: string;
  created_at?: string;
}

export interface CreatePostRequest {
  title: string;
  body: string;
  userId: string;
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
}

export interface UsersCountResponse {
  count: number;
}

export interface PostFormData {
  title: string;
  body: string;
}
