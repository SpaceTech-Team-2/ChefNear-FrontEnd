import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser } from './api';
// import axios from 'axios';

// const fetchUser = async () => {
//   const { data } = await axios.get('/api/me'); // السيرفر يفحص الـ Cookie أو ה-Bearer Token
//   return data;
// };

export const useLogin = () => {    
  const queryClient = useQueryClient();

  return useMutation({mutationFn: loginUser,
    onSuccess: (data) => {
      // حفظ بيانات اليوزر الراجعة في الكاش تحت المفتاح 'user'
      queryClient.setQueryData(['user'], data);
      localStorage.setItem('token', data.data.accessToken);
      console.log(queryClient.getQueryData(['user']));
      
    },
    onError: (error) => {
      console.error(' useUser Login failed:', error);
    }
  });
};


// export const useUser = () => {
//   return useQuery({
//     queryKey: ['user'],
//     queryFn: () => fetchingApi("get", "v1/Auth/me"),
//     retry: false,
//     staleTime: 1000 * 60 * 10,
//   });
// };
