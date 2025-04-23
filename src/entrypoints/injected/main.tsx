import './style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import Controller from '@/controller/index-inject';
import { getContainer, InjectContainerID } from '@/utils/webContainer.ts';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/queryClient';
export default function render() {
  getContainer(InjectContainerID).then((cnt) => {
    ReactDOM.createRoot(cnt).render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </React.StrictMode>,
    );
  });
}
