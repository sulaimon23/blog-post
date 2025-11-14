import { API_ENDPOINTS } from '@/constants';
import type { PaginationParams, UserResponse, UsersCountResponse } from '@/types';
import { apiClient } from '../api-client';

export const usersApi = {
    async getUsers(params: PaginationParams): Promise<UserResponse[]> {
        const { pageNumber, pageSize } = params;
        return apiClient.get<UserResponse[]>(
            `${API_ENDPOINTS.USERS}?pageNumber=${pageNumber}&pageSize=${pageSize}`
        );
    },

    async getUsersCount(): Promise<number> {
        const response = await apiClient.get<UsersCountResponse>(API_ENDPOINTS.USERS_COUNT);
        return response.count;
    },
};
