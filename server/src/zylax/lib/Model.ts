import * as _ from 'lodash';
import { EventEmitter } from 'events';
import Logger, { logger } from './Logger';

export interface ModelConfig {
    maxListeners?: number;
}

abstract class Model<TId extends string | number> extends EventEmitter {
    protected id: TId;
    protected static cnf: ModelConfig;
    
    cnf(): ModelConfig {
        // @ts-ignore
        return this.constructor.cnf;
    }

    logger: Logger;

    constructor(id: TId) {
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

    getId() {
        return this.id;
    }
}

export default Model;
