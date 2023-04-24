import * as _ from 'lodash';
import { EventEmitter } from 'events';
import Logger, { logger } from './Logger';

export interface ModelConfig {
    maxListeners?: number
}

abstract class Model extends EventEmitter {
    static cnf: ModelConfig;
    // @ts-ignore
    cnf(): ModelConfig { return this.constructor.cnf; };
    
    id: string;
    logger: Logger;

    constructor(id: string) {   
        super();    
        this.id = id;
        this.logger = logger.child({ label: this.toString() });
        
        if(this.cnf()) {
            if(typeof this.cnf().maxListeners === 'number') {
                this.setMaxListeners(this.cnf().maxListeners);
            }
        }
    }
    
    /**
     * Convert the model to a string.
     */
    toString(): string {
        const type = this.constructor.name;
        const id = this.id;

        return id ? `[${type} ${id}]` : `[${type}]`;
    }

    /**
     * Convert the model to JSON.
     */
    toJSON(): any {
        return { id: this.id };
    }

    /**
     * Check whether the model has any errors by calling this._validate().
     * @deprecated
     */
    checkValidity(): boolean {
        throw new Error('checkValidity() is deprecated.');
        // const _createMethod = (level) => {
        //     const isCritical = logger.levels[level] === 0;

        //     return (message, meta) => {
        //         if(this.logger)
        //             this.logger[level](message, meta);

        //         if(isCritical) 
        //             this.isInvalid = true;
        //     }
        // }

        // const methods = _.mapValues(logger.levels, (v, level) => _createMethod(level));

        // this._validate(methods);

        // return true;
    }
 
    /**
     * Check whether the model has any errors (must be implemented by child).
     */
    _validate(methods: any): string | void {
        throw new Error("Method '_validate()' is not implemented.");
    }
}

export default Model;