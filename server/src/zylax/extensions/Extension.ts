import Model, { ModelConfig } from '../lib/Model';
import * as _ from 'lodash';
import * as path from 'path';
import { globSync } from 'glob';
import ExtensionModule, { type ExtensionModuleTag } from './ExtensionModule';
import type Manifest from '../utils/Manifest';
import fs from 'fs';
import { Constructor } from '../types';
import ExtensionModuleNotRegisteredError from '../errors/ExtensionModuleNotRegisteredError';
import { resolveTemplate } from './utils';

const GLOB_PATTERN_MODULES = 'modules/**/*/index.js';
const GLOB_PATTERN_ASSETS  = [
    'assets/language/*.json'
];

export interface IExtensionModules {
    [key: string]: {
        [key: string]: Constructor<ExtensionModule>
    }
}

export interface IExtensionLib {
    activate: () => void
}

class Extension extends Model {
    public id: string;
    public dir: string;
    public modules: IExtensionModules = {};
    public manifest: Manifest;
    private lib: IExtensionLib;

    private loadingModules: string[] = [];

    constructor(manifest: Manifest, dir: string) {
        super(manifest.get('name'), {
            enableLogger: true
        });

        this.manifest = manifest;
        this.dir = dir;

        return this;
    }

    // /**
    //  * Get a module from the extension.
    //  * @param moduleType - The type of extension module.
    //  * @param id - The id of the module.
    //  * @param throwOnFail - 
    //  * @returns 
    //  */
    // getModule(moduleType, id, throwOnFail = true) {
    //     // Check if the module exists
    //     if(!this.modules[moduleType] || !this.modules[moduleType][id]) {
    //         if(throwOnFail)
    //             throw new ExtensionModuleNotFoundError(this, moduleType, id);
    //         return null;
    //     }
        
    //     // Return the module
    //     return this.modules[moduleType][id];
    // }

    // /**
    //  * Checks whether the extension has a given model.
    //  * @param {string} moduleType - The type of module to find.
    //  * @param {string} id - The id of the module to find.
    //  * @returns {boolean} - Whether the extension has the module.
    //  */
    // hasModule(moduleType, id) {
    //     return !!this.getModule(moduleType, id, false);
    // }

    /**
     * Register a module.
     * @param module - The module to register.
     */
    registerModule(tag: string, module: Constructor<ExtensionModule>) {
        const template = resolveTemplate(module);
        
        this.modules[template.name] = this.modules[template.name] || {};

        // If a module of this type and with this tag already exists, log an error.
        if(this.modules[template.name][tag]?.prototype instanceof ExtensionModule) {
            this.logger.error(`${template.name} '${this.id}.${tag}' was already registered.`);
            return;
        }

        this.modules[template.name][tag] = module;

        this.logger.debug(`Registered ${template.name} '${this.id}.${tag}'.`);
    }

    /**
     * Check whether the extension has a specific module.
     * @param moduleType - The type of the module to find.
     * @param moduleTag - The tag of the module to find.
     * @returns Whether the extension has the module.
     */
    hasFile(moduleType: string, moduleTag: ExtensionModuleTag) {
        return (this.getModuleSafe(moduleType, moduleTag) instanceof ExtensionModule);
    }

    /**
     * Get a module from the extension.
     * @param moduleType - The type of the module to find.
     * @param moduleTag - The tag of the module to find.
     * @returns The module.
     */
    getModule<T>(moduleType: string, moduleTag: ExtensionModuleTag): Constructor<T> {
        const module = this.getModuleSafe<T>(moduleType, moduleTag);

        if(module?.prototype instanceof ExtensionModule)
            return module;

        throw new ExtensionModuleNotRegisteredError(`${moduleType} '${this.id}.${moduleTag}' is not registered.`);
    }

    /**
     * Get a module from the extension without throwing an error if it can not be found.
     * @param moduleType - The type of the module to find.
     * @param moduleTag - The tag of the module to find.
     * @returns The module.
     */
    getModuleSafe<T>(moduleType: string, moduleTag: ExtensionModuleTag): Constructor<T> {
        if(!_.isPlainObject(this.modules[moduleType]))
            return null;

        const module = this.modules[moduleType][moduleTag];
        if(!(module?.prototype instanceof ExtensionModule))
            return null;

        return module as Constructor<T>;
    }

    /**
     * Load all assets found in the extension.
     */
    private loadAssets() {
        const filepaths = globSync(GLOB_PATTERN_ASSETS, { cwd: this.dir, absolute: true });

        // this.files['assets'] = {};
        // filepaths.forEach(filepath => {
        //     const asset = new ExtensionAsset(filepath);
        //     this.files['assets'][asset.id] = asset;
        // })

        return this;
    }

    /**
     * Load an extension.
     */
    activate() {
        return new Promise<void>((resolve, reject) => {
            const mainFilepath = this.getMainFilepath();

            if(!fs.existsSync(mainFilepath)) {
                return reject(new Error(`Cannot find main file, looked for '${mainFilepath}'.`));
            }

            this.lib = require(mainFilepath);

            // Call the 'activate()' function
            if(typeof this.lib?.activate === 'function') {
                this.lib.activate();
                this.logger.info('Activated succesfully.');
            } else {
                this.logger.notice(`No 'activate()' function was exported.`);
            }

            return resolve();
        })
    }

    private getMainFilepath() {
        let mainFilepath: string;
        
        if(process.env.NODE_ENV === 'development') {
            mainFilepath = path.resolve(this.dir, 'src/extension.ts');
            if(fs.existsSync(mainFilepath)) return mainFilepath;
        }

        if(typeof this.manifest.get('main') === 'string') {
            mainFilepath = path.resolve(this.dir, this.manifest.get('main'));
            if(fs.existsSync(mainFilepath)) return mainFilepath;
        }

        mainFilepath = path.resolve(this.dir, 'dist/extension.js');
        if(fs.existsSync(mainFilepath)) return mainFilepath;
        
        return null;
    }
}

export default Extension;