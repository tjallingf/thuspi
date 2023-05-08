import _ from 'lodash';
import RecordManager from '../RecordManager';
import * as constants from './constants';

export interface Values {
    [key: string]: number;
}

export interface SerializedRecord {
    d: string;
    v: Values;
    time?: number;
}

export default class Record {
    /**
     * Constants
     */
    static fields = constants.fields;

    private _date: Date;
    get date() {
        return this._date;
    }

    private _values: Values = {};
    get values() {
        return this._values;
    }

    constructor() {
        this._date = new Date();
    }

    setDate(date: Date) {
        this._date = date;
    }

    setValue(field: string, value: number) {
        this._values[field] = value;
    }

    setValues(values: Values) {
        _.defaults(this._values, values);
    }

    /**
     * Serialize the recording for storage.
     * @param manager - The recording manager (used for creating and registering new field aliases).
     * @returns {SerializedRecord} - Serialized version of the recording.
     */
    serialize(manager: RecordManager): SerializedRecord {
        const compactValues = {};

        _.forOwn(this._values, (value, field) => {
            // Aliases are used to minimize the amount of
            // disk space taken up by storing recordings
            let alias = manager.config.get(`fields.${field}.alias`);
            if (!alias) {
                alias = manager.generateUniqueFieldAlias();
                manager.storeFieldAlias(field, alias);
            }

            compactValues[alias] = value;
        });

        return {
            d: this._date.toISOString(),
            v: compactValues,
        };
    }

    toString() {
        return `[${this.constructor.name} ${this.date.toISOString()}]`;
    }
}
