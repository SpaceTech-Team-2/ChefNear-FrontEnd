import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'

import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/router.tsx';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    
    <RouterProvider router={router} />
    {/* <App /> */}
  </StrictMode>
);
