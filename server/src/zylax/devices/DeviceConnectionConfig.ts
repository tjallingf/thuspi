import * as _ from 'lodash';
import type { DeviceConnectionConfigData } from '~shared/types/devices/DeviceConnection';

export default class DeviceConnectionConfig {
    private data: DeviceConnectionConfigData;

    constructor(config: DeviceConnectionConfigData) {
        this.data = config;
    }

    isSet() {
        return (typeof this.data.type === 'string');
    }

    hasOptions() {
        return _.isPlainObject(this.data.options);
    }

    getOptions<T>(): T | null {
        if(!this.hasOptions()) return null;
        return this.data.options as T;
    }

    hasOption(keypath: string) {
        const value = _.get(this.data.options, keypath);
        return (value !== null && typeof value != 'undefined');
    }

    getOption(keypath: string) {
        if(!this.hasOption(keypath)) return null;
        return _.get(this.data.options, keypath);
    }

    /**
     * Set a connection option.
     * @param keypath - The keypath of the option to set.
     * @param value - The value to set the option to.
     */
    setOption(keypath: string, value: any): this {
        _.set(this.data.options, keypath, value);
        return this;
    }

    /**
     * Set the value of the 'type' field.
     * @returns The connection type.
     */
    getType() {
        if(typeof this.data.type !== 'string') return null;
        return this.data.type;
    }

    /**
     * Get the value of the 'type' field.
     */
    setType(type: string): this {
        this.data.type = type;
        return this;
    }

    toJSON() {
        return { type: this.data.type, options: this.data.options };
    }
}