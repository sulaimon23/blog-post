export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
    USERS: '/users',
    USERS_COUNT: '/users/count',
    POSTS: '/posts',
} as const;

export const QUERY_KEYS = {
    USERS: 'users',
    USERS_COUNT: 'users-count',
    POSTS: 'posts',
} as const;

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 4,
    DEFAULT_PAGE_NUMBER: 0,
} as const;

