class ExtensionAssetNotFoundError extends Error {
    constructor(ext, path) {
        super(`Extension asset ${path} not found in ${ext}.`);
        this.name = 'ExtensionAssetNotFoundError';
        this.httpStatus = 500;
    }
}

module.exports = ExtensionAssetNotFoundError;