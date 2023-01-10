const Controller = require('@controllers/Controller');
const glob = require('glob');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');

class ConfigController extends Controller {
    static secretKeypaths = ['secret', 'users', 'devices'];

    static populate() {
        // Get list of all config files
        const files = glob.sync('*.json', { cwd: DIRS.CONFIG });

        // Create array with the filenames as keys
        // and contents as values
        const data = Object.fromEntries(files.map(file => {
            const data = JSON.parse(fs.readFileSync(path.join(DIRS.CONFIG, file), 'utf8'));
            return [ path.parse(file).name, data ];
        }));

        return data;
    }

    static update(keypath, value) {
        _.set(this.data, keypath, value);
        const file = keypath.split('.')[0];

        return this.#throttledFlushToFile(file);
    }

    static updateById(file, id, props) {
        const obj = this.find(file);
        obj[id] = props;
        this.data[file] = obj;
        
        return this.#throttledFlushToFile(file);
    }

    static #flushToFile(file) {
        const filepath = path.join(DIRS.CONFIG, file+'.json');
        fs.writeFileSync(filepath, JSON.stringify(this.data[file]), 'utf8');
    }

    static #throttledFlushToFile = _.throttle(this.#flushToFile, 10000);
}

module.exports = ConfigController;