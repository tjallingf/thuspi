import _ from 'lodash';
import RecordManager from './RecordManager';

export interface Fields {
    [key: string]: number
}

export interface SerializedRecord {
    d: Date,
    f: Fields,
    time?: number
}

export default class Record {
    private _date: Date;
    get date() { return this._date };

    private _fields: Fields = {};
    get fields() { return this._fields; };

    constructor() {
        this._date = new Date();
    }

    setDate(date: Date) {
        this._date = date;
    }

    setField(field: string, value: number) {
        this._fields[field] = value;
    }

    setFields(fields: Fields) {
        _.defaults(this._fields, fields);
    }

    /**
     * Serialize the recording for storage.
     * @param manager - The recording manager (used for creating and registering new field aliases).
     * @returns {SerializedRecord} - Serialized version of the recording.
     */
    serialize(manager: RecordManager): SerializedRecord {
        const compactFields = {};

        _.forOwn(this._fields, (value, field) => {
            // Aliases are used to decrease the amount of
            // disk space taken up by storing recordings
            let alias = manager.config.get(`fields.${field}.alias`);
            if(!alias) {
                alias = manager.generateUniqueFieldAlias();
                manager.storeFieldAlias(field, alias);
            }
        
            compactFields[alias] = value;
        })

        return {
            d: this._date,
            f: compactFields
        };
    }

    toString() {
        return `[${this.constructor.name} ${this.date.toISOString()}]`;
    }
}