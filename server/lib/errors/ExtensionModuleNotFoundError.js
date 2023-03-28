class ExtensionModuleNotFoundError extends Error {
    constructor(ext, typeName, id) {
        super(`Extension module [${typeName} ${id}] not found in ${ext}.`);
        this.name = 'ExtensionModuleNotFoundError';
        this.httpStatus = 500;
    }
}

module.exports = ExtensionModuleNotFoundError;