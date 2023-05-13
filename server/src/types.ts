import { Response, Request as ExRequest, Express } from 'express';
import type ModelWithProps from './zylax/lib/ModelWithProps';

export type GetSerializedProps<M extends ModelWithProps<any, any, any>> = M extends ModelWithProps<any, infer S, any> ? S : unknown;

interface Request extends ExRequest {
    user: number;
    query: { [key: string]: string };
}

interface Server extends Express {}

export { Request, Response, Server };
