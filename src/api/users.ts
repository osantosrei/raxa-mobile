import type { UpdateProfileRequest, UserResponse } from '../types/api';
import { apiClient } from './client';

export const usersApi = {
  async me(): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>('/users/me');
    return response.data;
  },

  async update(data: UpdateProfileRequest): Promise<UserResponse> {
    const response = await apiClient.put<UserResponse>('/users/me', data);
    return response.data;
  },
};
