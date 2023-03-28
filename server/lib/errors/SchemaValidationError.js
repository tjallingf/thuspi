class SchemaValidationError extends Error {
    constructor(ajvErrorObject) {
        const err = ajvErrorObject[0];
        
        super(err.message+': '+ err.instancePath);
        this.name = 'SchemaValidationError';
        this.httpStatus = 500;
    }
}

module.exports = SchemaValidationError;