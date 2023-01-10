import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom';

import App from './components/App';
import ConfigProvider from './providers/ConfigProvider';
import UserProvider from './providers/UserProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TestRouter from './test/components/TestRouter';
import './styles/main.scss';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            retry: false
        }
    }
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <ConfigProvider>
            <UserProvider>
                <HashRouter>
                    <Routes>
                        <Route path="/test/*" element={<TestRouter />}></Route>
                        <Route path="*" element={<App />}/>
                    </Routes>
                </HashRouter>
            </UserProvider>
        </ConfigProvider>
    </QueryClientProvider>
)