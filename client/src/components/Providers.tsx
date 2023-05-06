import AuthProvider from '@/providers/AuthProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/utils/queryClient';
import React from 'react';

export interface IProvidersProps {
    children?: React.ReactNode
}

const Providers: React.FunctionComponent<IProvidersProps> = ({
    children
}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default Providers;