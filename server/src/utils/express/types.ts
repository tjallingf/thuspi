import { type User } from '@/zylax/users'
import { type Request as exRequest } from 'express';

export interface Request extends exRequest {
    user: User,
    query: {
        [key: string]: string
    }
}