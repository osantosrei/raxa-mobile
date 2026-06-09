import type { MatchResponse, PlayerResponse } from '../types/api';
import { apiClient } from './client';

export const playersApi = {
  async list(matchId: string): Promise<PlayerResponse[]> {
    const response = await apiClient.get<PlayerResponse[]>(`/matches/${matchId}/players`);
    return response.data;
  },

  async join(matchId: string): Promise<MatchResponse> {
    const response = await apiClient.post<MatchResponse>(`/matches/${matchId}/join`);
    return response.data;
  },

  async leave(matchId: string): Promise<void> {
    await apiClient.delete(`/matches/${matchId}/leave`);
  },
};
