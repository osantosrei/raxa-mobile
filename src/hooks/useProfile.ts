import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { usersApi } from '../api/users';

export const PROFILE_KEY = ['profile'] as const;

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: usersApi.me,
    staleTime: 1000 * 60,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.update,
    onSuccess: (user) => {
      queryClient.setQueryData(PROFILE_KEY, user);
      queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
    },
  });
}
