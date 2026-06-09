import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { playersApi } from '../api/players';
import { MATCHES_KEY, matchDetailKey } from './useMatches';

export function playersKey(matchId: string) {
  return [...matchDetailKey(matchId), 'players'] as const;
}

export function usePlayers(matchId: string) {
  return useQuery({
    queryKey: playersKey(matchId),
    queryFn: () => playersApi.list(matchId),
    staleTime: 1000 * 15,
  });
}

export function useJoinMatch(matchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => playersApi.join(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATCHES_KEY });
      queryClient.invalidateQueries({ queryKey: matchDetailKey(matchId) });
      queryClient.invalidateQueries({ queryKey: playersKey(matchId) });
    },
  });
}

export function useLeaveMatch(matchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => playersApi.leave(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATCHES_KEY });
      queryClient.invalidateQueries({ queryKey: matchDetailKey(matchId) });
      queryClient.invalidateQueries({ queryKey: playersKey(matchId) });
    },
  });
}
