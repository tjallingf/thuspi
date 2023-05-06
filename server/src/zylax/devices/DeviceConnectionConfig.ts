import * as _ from 'lodash';

export interface IDeviceConnectionConfigOptions {
    [key: string]: any
}

export interface IDeviceConnectionConfig {
    type: string,
    options: IDeviceConnectionConfigOptions
}

export default class DeviceConnectionConfig {
    private type?: string;
    private options?: IDeviceConnectionConfigOptions

    constructor(config: IDeviceConnectionConfig) {
        this.type    = config?.type;
        this.options = config?.options;
    }

    isSet() {
        return (typeof this.type === 'string');
    }

    hasOptions() {
        return _.isPlainObject(this.options);
    }

    getOptions<T>(): T {
        if(!this.hasOptions()) return null;
        return this.options as T;
    }

    hasOption(keypath: string) {
        const value = _.get(this.options, keypath);
        return (value !== null && typeof value != 'undefined');
    }

    getOption(keypath: string) {
        if(!this.hasOption(keypath)) return null;
        return _.get(this.options, keypath);
    }

    /**
     * Set a connection option.
     * @param keypath - The keypath of the option to set.
     * @param value - The value to set the option to.
     */
    setOption(keypath: string, value: any): this {
        _.set(this.options, keypath, value);
        return this;
    }

    /**
     * Set the value of the 'type' field.
     * @returns The connection type.
     */
    getType() {
        if(typeof this.type !== 'string') return null;
        return this.type;
    }

    /**
     * Get the value of the 'type' field.
     */
    setType(type: string): this {
        this.type = type;
        return this;
    }

    toJSON() {
        return { type: this.type, options: this.options };
    }
}