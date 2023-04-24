import NotFoundError from '@/errors/api/NotFoundError';
import { Constructor } from '@/zylax/types';
import _ from 'lodash';
import ModelWithProps from '@/zylax/lib/ModelWithProps';
import ApiError from '@/errors/api/ApiError';
import { Request } from '../types';
import { NextFunction, Response } from 'express';
import PermissionError from '@/errors/api/PermissionError';
import dayjs from 'dayjs';

export type ApiModel = Constructor<ModelWithProps>;
export type ApiResponsePermissionChecker<T extends ApiModel> = (permission: string, model: InstanceType<T>) => boolean;
export interface ApiResponseOptions<T extends ApiModel> {
    permissionChecker?: ApiResponsePermissionChecker<T>
}

export default function api<T extends ApiModel>(
    model: T, 
    handler: (res: ApiResponse<T>, req: Request) => any
) {
    return async function(req, res, next) {
        const api = new ApiResponse<T>(model, req, res, next);
        
        try {
            await handler(api, req);
            res.json(api.resBody);
        } catch(err) {
            if(!(err instanceof ApiError)) {
                console.error(err);
            }

            return next(err);
        }
    }
}

export class ApiResponse<T extends ApiModel> {
    private req: Request;
    private reqUrl: URL;
    private res: Response;
    private next: NextFunction;
    private options: ApiResponseOptions<T> = {};

    public resBody = {
        result: {},
        aggregation: {}
    }

    private model: T;
    private controller: any;

    constructor(model: T, req: Request, res: Response, next: NextFunction) {
        this.model = model;
        this.controller = this.model.prototype.cnf().controller;

        this.req = req;
        this.res = res;
        this.reqUrl = new URL(req.originalUrl, 'http://127.0.0.1');
        this.next = next;
    }

    getResource(resourceId: string): InstanceType<T> {
        const resource = this.controller.find(resourceId);

        if(!resource) {
            throw new NotFoundError();
        }

        const [ hasPermission, permission] = this.hasPermissionForResource(resource);
        if(!hasPermission) {
            throw new PermissionError(permission);
        }

        return resource;
    }
    
    getCollection(): InstanceType<T>[] {
        let collection: InstanceType<T>[] = this.controller.index();

        collection = collection.filter(resource => this.hasPermissionForResource(resource)[0]);

        return collection;
    }
    
    async querySwitch(...cases: ([ {} , (arg0: any) => any ])[]) {
        const match = cases.map(([ types, handler ]) => {
            let parsedQuery = {};

            const isMatch = _.every(types, (type: any, key: string) => {
                const value = this.req.query[key];
                
                if(typeof value === 'undefined') {
                    return false;
                }

                let parsedValue;
                switch(type) {
                    case 'string':
                        parsedValue = value+'';
                        break;
                    case 'number':
                        parsedValue = parseFloat(value);
                        break;
                    case 'date':
                        parsedValue = dayjs(value).toDate();
                        break;
                }

                if(parsedValue && (parsedValue instanceof Date ? parsedValue.getTime() : true)) {
                    parsedQuery[key] = parsedValue;
                    return true;
                }
            })

            return { isMatch, parsedQuery, handler };
        }).filter(c => c.isMatch)[0];
        
        if(!match) {
            throw new ApiError('Invalid query.', 400, { 
                cases: cases.map(c => c[0]) 
            });
        }

        return match.handler(match.parsedQuery);
    }

    setPermissionChecker(permissionChecker: ApiResponsePermissionChecker<T>) {
        this.options.permissionChecker = permissionChecker;
    }

    private hasPermissionForResource(resource: InstanceType<T>): [ boolean, string ] {
        const permission = this.findPermissionForResource(resource);

        let hasPermission = typeof this.options.permissionChecker === 'function'
            ? this.options.permissionChecker(permission, resource)
            : this.req.user.hasPermission(permission);
        
        return [ hasPermission, permission ];
    }

    private findPermissionForResource(resource: InstanceType<T>) {       
        // Split the request url pathname, i.e. ['api', 'devices', '1', 'records']
        const pathnameParts = _.trim(this.reqUrl.pathname, '/').split('/');

        // The permission's scope, e.g. 'devices.1.records' or 'devices.1'
        const permissionScope = _.trimEnd(`${pathnameParts[1]}.${resource.id}.${pathnameParts.slice(3)}`, '.');

        // The action that the user currently performs
        const permissionAction = this.getCurrentAction();

        // The full permission needed to access the resource, e.g. 'devices.1.records.view'
        return `${permissionScope}.${permissionAction}`;
    }

    private getCurrentAction() {       
        if(this.req.method === 'GET') return 'view';
        if(this.reqUrl.pathname.includes('/admin/')) return 'manage';

        return null;
    }

    withAggregation(aggregation: Object): this {
        this.resBody.aggregation = aggregation;
        return this;
    }

    withResult(json: Object): this {
        this.resBody.result = typeof json === 'undefined' ? {} : json;
        return this;
    }

    async withResource(resource: InstanceType<T>) {
        this.withResult(await this.serializeResource(resource));     
    }

    async withCollection(collection: InstanceType<T>[]) {
        this.withResult(await this.serializeCollection(collection));
    }

    protected async serializeResource(resource: InstanceType<T>): Promise<Object> {
        let props = Object.assign({ id: resource.id }, await resource.addDynamicProps(resource.getProps(false)));

        // The ?filter=a,b,c query parameter allows for only
        // including specified props of a resource.
        if(this.req.query.filter) {
            // Get an array of the props to filter.
            const filterProps = this.req.query.filter.split(',');

            // The id must always be included.
            filterProps.unshift('id');

            // Filter the props.
            props = _.pick(props, filterProps);
        }

        return props;
    }

    protected async serializeCollection(collection: InstanceType<T>[]): Promise<Array<Object>> {
        return Promise.all(collection.map(r => this.serializeResource(r)));
    }
}

// class ApiRoute {
//     constructor(req, res, next) {

//     }
// }

// export default function api<T extends Model>({ action, permission, hasPermission, controller }: ApiMiddlewareArgs<T>) {
//     return async function(req, res, next) {
//         if(typeof permission === 'string') {
//             permission = permission.replace(/{([a-z]+)}/g, ($1, $2) => req.params[$2]);

//             // Throw an error if the user does not have permission to access this resource.
//             if(!req.user.hasPermission(permission))
//                 return next(new PermissionError());
//         }

//         if(controller?.prototype instanceof Controller) {
//             if(action.method === 'index') {
//                 let index: T[] = await controller.index();

//                 // Filter the index by the 'action.filterByPermission' field
//                 if(typeof action.filterByPermission === 'string') {
//                     index = index.filter(model => {
//                         let permission = action.filterByPermission.replace('{id}', model.id.toString());
//                         return req.user.hasPermission(permission);
//                     })
//                 }

//                 // Filter the index by the 'action.filter()' function
//                 if(typeof action.filter === 'function') {
//                     index = index.filter(model => action.filter(model, req));
//                 }
                
//                 if(action.end) {   
//                     // Serialize the models
//                     let json = await Promise.all(index.map(model => serializeModel<T>(model, action)));
//                     return res.json(json);
//                 } else {
//                     req.getResource = () => index;
//                 }
//             } else if(action.method === 'find' || action.method === 'edit') {
//                 // The id of the resource to find.
//                 const id = typeof action.id === 'function' ? action.id(req) : req.params.id;

//                 const model = await controller.find<T>(id);

//                 if(!model) {
//                     return next(new NotFoundError());
//                 }
                
//                 if(typeof hasPermission === 'function' && !hasPermission(model, req)) {
//                     return next(new PermissionError());
//                 }

//                 if(action.end) {
//                     // Serialize the model
//                     let json = await serializeModel(model, action);
//                     return res.json(json);
//                 } else {
//                     req.getResource = () => model;

//                 }
//             }
//         }

//         next();
//     }
// }