import { Constructor } from '@/zylax/types';
import _ from 'lodash';
import Model from '@/zylax/lib/Model';
import ApiError from '@/errors/api/ApiError';
import { RequestHandler } from 'express';
import { Request } from './types';
import { NextFunction, Response } from 'express';
import dayjs from 'dayjs';
import ModelWithProps from '@/zylax/lib/ModelWithProps';

export type ApiModel = Constructor<ModelWithProps> | Constructor<Model>;

export type ApiRoutePermissionHandler<T extends ApiModel> = (permission: string, model: InstanceType<T>) => boolean;
export type ApiRouteFindHandler<T extends ApiModel> = (id: string & number) => InstanceType<T>;
export type ApiRouteHandler<T extends ApiModel> = (route: ApiRoute<T>, req: Request, res: Response) => any;

export interface ApiRouteOptions<T extends ApiModel> {
    permissionHandler?: ApiRoutePermissionHandler<T>;
    findHandler?: (id: string) => InstanceType<T>;
}

export default function apiRoute<T extends ApiModel>(model: T, handler: ApiRouteHandler<T>) {
    return async function (req, res, next) {
        const route = new ApiRoute<T>(model, req, res, next);

        try {
            await handler(route, req, res)
                .then(() => {
                    res.json(route.resBody);
                })
                .catch((err) => {
                    route.handleError(err);
                });
        } catch (err) {
            route.handleError(err);
        }
    };
}

export class ApiRoute<T extends ApiModel> {
    private req: Request;
    private reqUrl: URL;
    private res: Response;
    private next: NextFunction;
    private options: ApiRouteOptions<T> = {};

    public resBody = {
        result: {},
        aggregation: {},
    };

    private controller: any;

    constructor(model: T, req: Request, res: Response, next: NextFunction) {
        this.controller = model?.prototype?.cnf?.()?.controller;

        this.req = req;
        this.res = res;
        this.reqUrl = new URL(req.originalUrl, 'http://127.0.0.1');
        this.next = next;
    }

    getDocument(documentId: string): InstanceType<T> {
        let document: InstanceType<T>;
        if (typeof this.options.findHandler === 'function') {
            document = this.options.findHandler(documentId);
        } else if (typeof this.controller?.find === 'function') {
            document = this.controller.find(documentId);
        }

        if (!document) {
            throw new ApiError('NotFoundError', 'Document not found', 404, { documentId });
        }

        const [hasPermission, permission] = this.hasPermissionForDocument(document);
        if (!hasPermission) {
            throw new ApiError('PermissionError', 'No permission to access this document.', 401, { permission });
        }

        return document;
    }

    getCollection(): InstanceType<T>[] {
        let collection: InstanceType<T>[] = this.controller.index();

        collection = collection.filter((document) => this.hasPermissionForDocument(document)[0]);

        return collection;
    }

    async querySwitch(...cases: [{}, (arg0: any) => any][]) {
        const match = cases
            .map(([types, handler]) => {
                let parsedQuery = {};

                const isMatch = _.every(types, (type: any, key: string) => {
                    const value = this.req.query[key];

                    if (typeof value === 'undefined') {
                        return false;
                    }

                    let parsedValue;
                    switch (type) {
                        case 'string':
                            parsedValue = value + '';
                            break;
                        case 'number':
                            parsedValue = parseFloat(value);
                            break;
                        case 'date':
                            parsedValue = dayjs(value).toDate();
                            break;
                    }

                    if (parsedValue && (parsedValue instanceof Date ? parsedValue.getTime() : true)) {
                        parsedQuery[key] = parsedValue;
                        return true;
                    }
                });

                return { isMatch, parsedQuery, handler };
            })
            .filter((c) => c.isMatch)[0];

        if (!match) {
            throw new ApiError('InvalidQueryError', 'Invalid query.', 400, {
                cases: cases.map((c) => c[0]),
            });
        }

        return match.handler(match.parsedQuery);
    }

    setPermissionHandler(permissionHandler: ApiRoutePermissionHandler<T>) {
        this.options.permissionHandler = permissionHandler;
    }

    setFindHandler(findHandler: ApiRouteFindHandler<T>) {
        this.options.findHandler = findHandler;
    }

    handleError(err: Error | string) {
        if (!(err instanceof ApiError)) {
            console.error(err);
        }

        let formattedErr;
        if (err instanceof ApiError) {
            formattedErr = err;
        } else if (err instanceof Error) {
            formattedErr = new ApiError('InternalError', err.message, 500);
        } else {
            formattedErr = new ApiError('InternalError', err + '', 500);
        }

        this.res.status(formattedErr.status).json(formattedErr.toJSON());
    }

    private hasPermissionForDocument(document: InstanceType<T>): [boolean, string] {
        const permission = this.findPermissionForDocument(document);

        let hasPermission =
            typeof this.options.permissionHandler === 'function'
                ? this.options.permissionHandler(permission, document)
                : this.req.user.hasPermission(permission);

        return [hasPermission, permission];
    }

    private findPermissionForDocument(document: InstanceType<T>) {
        // Split the request url pathname, i.e. ['api', 'devices', '1', 'records']
        const pathnameParts = _.trim(this.reqUrl.pathname, '/').split('/');

        // The permission's scope, e.g. 'devices.1.records' or 'devices.1'
        const permissionScope = _.trimEnd(`${pathnameParts[1]}.${document.id}.${pathnameParts.slice(3)}`, '.');

        // The action that the user currently performs
        const permissionAction = this.getCurrentAction();

        // The full permission needed to access the document, e.g. 'devices.1.records.view'
        return `${permissionScope}.${permissionAction}`;
    }

    private getCurrentAction() {
        if (this.req.method === 'GET') return 'view';
        if (this.reqUrl.pathname.includes('/admin/')) return 'manage';

        return null;
    }

    setAggregation(aggregation: Object): this {
        this.resBody.aggregation = aggregation;
        return this;
    }

    respondWith(json: Object): this {
        this.resBody.result = typeof json === 'undefined' ? {} : json;
        return this;
    }

    async respondWithDocument(document: InstanceType<T>) {
        this.respondWith(this.applyQueryModifiers(await this.serializeDocument(document)));
    }

    async respondWithCollection(collection: InstanceType<T>[]) {
        this.respondWith(
            await Promise.all(collection.map((document) => this.applyQueryModifiers(this.serializeDocument(document)))),
        );
    }

    public applyQueryModifiers<T>(props: T): T {
        // The ?filter=a,b,c query parameter allows for only
        // including specified props of a document.
        if (this.req.query.filter) {
            // Get an array of the props to filter.
            const filterProps = this.req.query.filter.split(',');

            // The id must always be included.
            filterProps.unshift('id');

            // Filter the props.
            props = _.pick(props, filterProps);
        }

        return props;
    }

    protected async serializeDocument(document: InstanceType<T>): Promise<Object> {
        let props = {};
        if (document instanceof ModelWithProps) {
            props = await document.addDynamicProps(document.getProps(false));
        } else if (typeof document.toJSON === 'function') {
            props = document.toJSON();
        } else {
            props = document;
        }

        return Object.assign({ id: document.id }, props);
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

//             // Throw an error if the user does not have permission to access this document.
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
//                     req.getDocument = () => index;
//                 }
//             } else if(action.method === 'find' || action.method === 'edit') {
//                 // The id of the document to find.
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
//                     req.getDocument = () => model;

//                 }
//             }
//         }

//         next();
//     }
// }
