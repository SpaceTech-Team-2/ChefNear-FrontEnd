import { useQueryClient } from '@tanstack/react-query';

export default function useSetToken() {
  const queryClient = useQueryClient();

  const setToken = (accessToken, refreshToken) => {
    queryClient.setQueryData(['Token'], {
      accessToken,
      refreshToken,
    });
  };

  return setToken;
}