import { User } from '@/zylax/users';

import { Response, Request as ExRequest, Express } from 'express';

interface Request extends ExRequest {
    user: User;
    query: { [key: string]: string };
}

interface Server extends Express {}

export { Request, Response, Server };
