import { apiClient } from '../api-client';
import { API_ENDPOINTS } from '@/constants';
import type { Post, CreatePostRequest } from '@/types';

export const postsApi = {
  async getPostsByUserId(userId: string | number): Promise<Post[]> {
    return apiClient.get<Post[]>(`${API_ENDPOINTS.POSTS}?userId=${userId}`);
  },

  async createPost(data: CreatePostRequest): Promise<Post> {
    return apiClient.post<Post>(API_ENDPOINTS.POSTS, data);
  },

  async deletePost(postId: string): Promise<void> {
    return apiClient.delete<void>(`${API_ENDPOINTS.POSTS}/${postId}`);
  },
};
