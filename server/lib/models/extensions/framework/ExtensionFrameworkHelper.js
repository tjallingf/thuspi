const StackTrace = require('stacktrace-js');
const path = require('path');
const ExtensionController = require('@/controllers/ExtensionController');

class ExtensionFrameworkHelper {
    extension;
    filepath;

    constructor() {
        const trace = StackTrace.getSync();
        const filepath = trace[3]?.fileName;
        if(!filepath) 
            throw new Error('Failed to get stack trace.');

        if(!filepath.startsWith(EXTENSIONS_DIR)) 
            throw new Error('extension() can only be called inside an extension module.');

        const extId = path.relative(EXTENSIONS_DIR, filepath).split(path.sep)[0];
        const ext = ExtensionController.find(extId);
        
        this.filepath = filepath;
        this.extension = ext;
    }
}

module.exports = ExtensionFrameworkHelper;