import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';

import { UserContextProvider } from './contexts/userContext.tsx';
import { NotificationContextProvider } from './contexts/NotificationContext.tsx';

const queryClinet = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NotificationContextProvider>
      <UserContextProvider>
        <QueryClientProvider client={queryClinet}>
          <App />
        </QueryClientProvider>
      </UserContextProvider>
    </NotificationContextProvider>
  </React.StrictMode>,
);
