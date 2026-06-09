import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { matchesApi } from '../api/matches';

export const MATCHES_KEY = ['matches'] as const;

export function matchDetailKey(matchId: string) {
  return [...MATCHES_KEY, matchId] as const;
}

export function useMatches() {
  return useQuery({
    queryKey: MATCHES_KEY,
    queryFn: matchesApi.list,
    staleTime: 1000 * 30,
  });
}

export function useMatchDetail(matchId: string) {
  return useQuery({
    queryKey: matchDetailKey(matchId),
    queryFn: () => matchesApi.get(matchId),
    staleTime: 1000 * 15,
  });
}

export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matchesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATCHES_KEY });
    },
  });
}

export function useCancelMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matchesApi.cancel,
    onSuccess: (_data, matchId) => {
      queryClient.invalidateQueries({ queryKey: MATCHES_KEY });
      queryClient.invalidateQueries({ queryKey: matchDetailKey(matchId) });
    },
  });
}
