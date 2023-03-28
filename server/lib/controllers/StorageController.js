const Controller = require('@/controllers/Controller');
const { globSync } = require('glob');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');

class StorageController extends Controller {
    static index() {
        if(this.files == undefined)
            this._populate();

        return Object.fromEntries(this.files.map(file => {
            return [ path.parse(file).name, content ];
        }));
    }

    static find(file) {
        const filepath = path.join(STORAGE_DIR, file+'.json');

        if(!fs.existsSync(filepath))
            return null;

        return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }

    static update(file, data) {
        const filepath = path.join(STORAGE_DIR, file+'.json');

        if(!fs.existsSync(filepath))
            return null;

        return fs.writeFileSync(filepath, JSON.stringify(data), 'utf8');
    }

    static _populate() {
        this.files = globSync('data/*.json', { cwd: STORAGE_DIR });
    }
}

module.exports = StorageController;