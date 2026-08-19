import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser } from './api';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
      queryClient.setQueryData(['refreshToken'], data.data.refreshToken);

    },
    onError: (error) => {
      console.error('useUser Login failed:', error);
    },
  });
};
