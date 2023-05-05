import * as _ from 'lodash';
import { EventEmitter } from 'events';
import Logger, { logger } from './Logger';

export interface ModelConfig {
    maxListeners?: number;
}

abstract class Model extends EventEmitter {
    static cnf: ModelConfig;
    // @ts-ignore
    cnf(): ModelConfig {
        return this.constructor.cnf;
    }

    id: string;
    logger: Logger;

    constructor(id: string) {
        super();
        this.id = id;
        this.logger = logger.child({ label: this.toString() });

        if (this.cnf()) {
            if (typeof this.cnf().maxListeners === 'number') {
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
}

export default Model;