import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'

import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/router.tsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>

    <QueryClientProvider client={queryClient}>

    <RouterProvider router={router} />
    
    </QueryClientProvider>
    {/* <App /> */}
  </StrictMode>
);
