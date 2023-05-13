import path from 'path';
import fs from 'fs/promises';
import _ from 'lodash';
import { CONFIG_DIR } from '../constants';
import { logger } from '../lib/Logger';
import { glob } from 'glob';

export default class Config {
    private static cache: {[key: string]: any} = {};

    static async load() {
        const pattern = path.join(CONFIG_DIR, '*.json').replace(/\\/g, '/');
        const filepaths = await glob(pattern, { absolute: true });
        
        for(const filepath of filepaths) {
            const filename = path.parse(filepath).name;

            try {
                const contents = JSON.parse(await fs.readFile(filepath, 'utf8'));
                this.cache[filename] = contents;
            } catch(err: any) {
                logger.error(`The following error occured while reading config file '${filename}':`);
                logger.error(err);
            } 
        }

        return this.cache;
    }

    static get(keypath: string): any {
        const value = this.getOrFail(keypath);

        if (typeof value === 'undefined') {
            throw new Error(`Config entry '${keypath}' is undefined.`);
        }

        return value;
    }

    static getOrFail(keypath: string) {
        return keypath.length ? _.get(this.cache, keypath) : this.cache;
    }

    static getOrCreate(keypath: string, newValue: any): any {
        const currentValue = this.get(keypath);
        if(typeof currentValue !== 'undefined') {
            return currentValue;
        }

        this.update(keypath, newValue);
        logger.debug(`Created new config entry '${keypath}'.`);
        
        return newValue;
    }

    static update(keypath: string, value: any) {
        const [ filename ] = this.splitKeypath(keypath);
        if(typeof this.cache[filename] === 'undefined') {
            return;
        }

        // Update the cache
        _.set(this.cache, keypath, value);
        
        const filepath = path.join(CONFIG_DIR, filename+'.json');
        
        // Write the updated data to the file
        return fs.writeFile(filepath, JSON.stringify(this.cache[filename]));
    }
    
    private static splitKeypath(keypath: string): [ string, string ] {
        const split = keypath.split('.')[0];
        return [ split[0], split.slice(1) ];
    }
}
