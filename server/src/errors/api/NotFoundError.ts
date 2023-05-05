import ApiError from './ApiError';

export default class NotFoundError extends ApiError {
    constructor(resourceId?: string) {
        super('Resource not found.', 404, { resourceId });
    }
}
