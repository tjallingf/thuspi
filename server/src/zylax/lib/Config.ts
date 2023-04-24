import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import { CONFIG_DIR } from '../constants';
import { logger } from '../lib/Logger';

export default class Config {
    private static cache = {};

    static get(keypath: string): any {
        const filename = keypath.split('.')[0];

        const rest = keypath.split('.').slice(1);
        const data = this.getFile(filename);

        return (rest.length ? _.get(data, rest) : data);
    }

    static set(keypath: string, value: any) {
        throw new Error('TODO: Implement Config.set().');
    }

    private static getFile(filename: string) {
        const filepath = path.join(CONFIG_DIR, filename+'.json');

        if(!this.cache[filepath]) {
            try {
                const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
                this.cache[filepath] = data;
            } catch(err) {
                logger.error(err);
            }
        }

        return this.cache[filepath];
    }
}