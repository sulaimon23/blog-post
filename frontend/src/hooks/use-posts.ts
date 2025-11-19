import { QUERY_KEYS } from '@/constants';
import { postsApi } from '@/lib/api/posts.api';
import type { CreatePostRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function usePosts(userId: string | number | undefined) {
    return useQuery({
        queryKey: [QUERY_KEYS.POSTS, userId],
        queryFn: async () => {
            if (!userId) throw new Error('User ID is required');
            const posts = await postsApi.getPostsByUserId(userId);
            return Array.isArray(posts) ? posts : [];
        },
        enabled: !!userId,
        staleTime: 30000,
        retry: 2,
        placeholderData: (prev) => (Array.isArray(prev) ? prev : []),
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePostRequest) => postsApi.createPost(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.POSTS, variables.userId],
            });
            toast.success('Post created successfully.');
        },
        onError: (error: any) => {
            const errorMessage = error?.message || 'Failed to create post';
            toast.error(errorMessage);
        },
    });
}

export function useDeletePost(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => postsApi.deletePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.POSTS, userId],
            });
            toast.success('Post deleted successfully.');
        },
        onError: (error: any) => {
            const errorMessage = error?.message || 'Failed to delete post';
            toast.error(errorMessage);
        },
    });
}
