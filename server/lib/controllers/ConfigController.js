const Controller = require('@/controllers/Controller');
const { globSync } = require('glob');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');

class ConfigController extends Controller {
    static data;
    static privateKeypaths = ['secret', 'users', 'devices'];

    static _populate() {
        // Get list of all config files
        const files = globSync('*.json', { cwd: CONFIG_DIR });

        // Create array with the filenames as keys
        // and contents as values
        const data = Object.fromEntries(files.map(file => {
            const data = JSON.parse(fs.readFileSync(path.join(CONFIG_DIR, file), 'utf8'));
            return [ path.parse(file).name, data ];
        }));

        return data;
    }

    static update(keypath, value) {
        _.set(this.data, keypath, value);
        const file = keypath.split('.')[0];
        const filepath = path.join(CONFIG_DIR, file+'.json');
        fs.writeFileSync(filepath, JSON.stringify(this.data[file]), 'utf8');
    }
}

module.exports = ConfigController;