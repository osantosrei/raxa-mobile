import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { invitesApi } from '../api/invites';
import { MATCHES_KEY, matchDetailKey } from './useMatches';

export function invitePreviewKey(code: string) {
  return ['invite', code] as const;
}

export function useInvitePreview(code: string) {
  return useQuery({
    queryKey: invitePreviewKey(code),
    queryFn: () => invitesApi.resolve(code),
    retry: false,
    staleTime: 1000 * 60,
  });
}

export function useJoinViaInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invitesApi.join,
    onSuccess: (match) => {
      queryClient.invalidateQueries({ queryKey: MATCHES_KEY });
      queryClient.invalidateQueries({ queryKey: matchDetailKey(match.id) });
    },
  });
}
