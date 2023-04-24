import ApiError from './ApiError';

export default class PermissionError extends ApiError {
    constructor(permission: string) {       
        super('No permission to access this resource.', 401, { permission });
    }
}