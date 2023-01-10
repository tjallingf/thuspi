const { uuid } = require('@lib/helpers');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const TempFileController = require('@controllers/TempFileController');

class TempFileManager {
    filename;
    filepath;
    deleteAt;
    id;

    constructor(extension = 'txt', deleteAfter = 30*60*1000) {
        this.deleteAt = new Date(Date.now() + deleteAfter);
        this.id = `${this.deleteAt.getTime()}-${uuid()}`;
        this.filename = `${this.id}.${_.trimStart(extension, '.')}`;
        this.filepath = path.join(DIRS.TMP, this.filename);

        TempFileController.update(this.id, this.filepath);

        setTimeout(this.delete, deleteAfter);
    }

    getPath() {
        return this.filepath;
    }

    delete() {
        TempFileController.delete(this.id);

        if(fs.existsSync(this.filepath)) {
            fs.removeFileSync(this.filepath);
        }

        return this;
    }
}

module.exports = TempFileManager;