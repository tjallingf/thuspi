class NotFoundError extends Error {
    constructor(message = 'Not found.') {
        super(message);
        this.name = 'NotFoundError';
        this.httpStatus = 404;
    }
}

module.exports = NotFoundError;