import ApiError from './ApiError';

export default class NotFoundError extends ApiError {
    constructor(message: string = 'Resource not found.') {
        super(message, 404);
    }
}