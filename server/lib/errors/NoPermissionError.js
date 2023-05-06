class NoPermissionError extends Error {
    constructor(message = 'No permission.') {
        super(message);
        this.name = 'NoPermissionError';
        this.httpStatus = 403;
    }
}

module.exports = NoPermissionError;