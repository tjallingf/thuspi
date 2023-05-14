import { UserController } from '../zylax/users';
import { TRPCError, inferAsyncReturnType } from '@trpc/server';
import { type Request as ExRequest, type Response } from 'express';
import ModelWithProps from '../zylax/lib/ModelWithProps';
import { Constructor, GetTPropsSerialized } from '../zylax/types';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';

interface Request extends ExRequest {
    user: any
}

export const createContext = async ({ req, res }: { req: Request, res: Response }) => {
    const user = UserController.find(req.user?.id) || UserController.findDefaultUser();

    const requirePermission = (permission: string) => {
        if(typeof permission === 'string' && !user.hasPermission(permission)) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: `Missing permission: '${permission}'.`
            })
        }

        return true;
    }

    const getDocumentOrThrow = async <T extends ModelWithProps<any, any, any>>(model: Constructor<T>, id: number | string): Promise<GetTPropsSerialized<T>> => {
        const controller = model.prototype.cnf().controller;
        const document = controller.find(id);
        
        if(!document) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `${model.name} ${id} not found.`
            })
        }

        return await document.serialize();
    }

    const getCollection = async <T extends ModelWithProps<any, any, any>>(model: Constructor<T>, hasPermission?: (document: T) => boolean) => {
        const controller = model.prototype.cnf().controller;
        let collection = controller.index();

        if(typeof hasPermission === 'function') {
            collection = collection.filter(hasPermission);
        }  

        return collection;
    }

    return {
        user,
        req,
        res,
        requirePermission,
        getDocumentOrThrow,
        getCollection
    };
};

export type Context = inferAsyncReturnType<typeof createContext>;
