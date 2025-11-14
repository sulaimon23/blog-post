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

export function useUsersCount() {
    return useQuery({
        queryKey: [QUERY_KEYS.USERS_COUNT],
        queryFn: () => usersApi.getUsersCount(),
        staleTime: 60000,
        retry: 2,
    });
}

export function useUsersWithPagination(
    pageNumber: number = PAGINATION.DEFAULT_PAGE_NUMBER,
    pageSize: number = PAGINATION.DEFAULT_PAGE_SIZE
) {
    const usersQuery = useUsers({ pageNumber, pageSize });
    const countQuery = useUsersCount();

    return {
        users: usersQuery.data ?? [],
        count: countQuery.data ?? 0,
        isLoading: usersQuery.isLoading || countQuery.isLoading,
        isError: usersQuery.isError || countQuery.isError,
        error: usersQuery.error || countQuery.error,
        refetch: () => {
            usersQuery.refetch();
            countQuery.refetch();
        },
    };
}
