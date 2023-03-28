import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface IQueryFn {
    data: string
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: async ({ queryKey: [ url, config ] }): Promise<IQueryFn> => {
                const { data } = await axios.request({
                    ...(config as object),
                    url: `api/${url}`
                });
                
                return data;
            }
        }
    }
});

export default queryClient;