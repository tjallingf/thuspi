class ExtensionNotInstalledError extends Error {
    constructor(extensionId) {
        super(`Extension '${extensionId}' is not installed.`);
        this.name = 'ExtensionNotInstalledError';
        this.httpStatus = 500;
    }
}

module.exports = ExtensionNotInstalledError;