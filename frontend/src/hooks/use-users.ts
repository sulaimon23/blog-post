import { PAGINATION, QUERY_KEYS } from '@/constants';
import { usersApi } from '@/lib/api/users.api';
import type { PaginationParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useUsers(params: PaginationParams) {
    return useQuery({
        queryKey: [QUERY_KEYS.USERS, params.pageNumber, params.pageSize],
        queryFn: () => usersApi.getUsers(params),
        staleTime: 30000,
        retry: 2,
    });
}

export function useUser(userId: string | undefined) {
    return useQuery({
        queryKey: [QUERY_KEYS.USERS, userId],
        queryFn: () => {
            if (!userId) throw new Error('User ID is required');
            return usersApi.getUserById(userId);
        },
        enabled: !!userId,
        staleTime: 30000,
        retry: 2,
    });
}

export function useUsersCount() {
    return useQuery({
        queryKey: [QUERY_KEYS.USERS_COUNT],
        queryFn: async () => {
            const count = await usersApi.getUsersCount();
            return count ?? 0;
        },
        staleTime: 60000,
        retry: 2,
        placeholderData: 0,
    });
}

export function useUsersWithPagination(
    pageNumber: number = PAGINATION.DEFAULT_PAGE_NUMBER,
    pageSize: number = PAGINATION.DEFAULT_PAGE_SIZE
) {
    const usersQuery = useQuery({
        queryKey: [QUERY_KEYS.USERS, pageNumber, pageSize],
        queryFn: async () => {
            const users = await usersApi.getUsers({ pageNumber, pageSize });
            return Array.isArray(users) ? users : [];
        },
        staleTime: 30000,
        retry: 2,
        placeholderData: (prev) => (Array.isArray(prev) ? prev : []),
    });
    const countQuery = useUsersCount();

    const users = usersQuery.data ?? [];
    const count = countQuery.data ?? 0;

    return {
        users: Array.isArray(users) ? users : [],
        count: typeof count === 'number' ? count : 0,
        isLoading: usersQuery.isLoading || countQuery.isLoading,
        isFetching: usersQuery.isFetching || countQuery.isFetching,
        isError: usersQuery.isError || countQuery.isError,
        error: usersQuery.error || countQuery.error,
        refetch: () => {
            usersQuery.refetch();
            countQuery.refetch();
        },
    };
}
