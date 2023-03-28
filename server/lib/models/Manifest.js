const _ = require('lodash');
const { validate } = require('@/utils/validation');

class Manifest {
    #data = {};

    constructor(data) {
        this.#data = data;
    }

    isFalse(keypath) {
        return !this.get(keypath);
    }

    isTrue(keypath) {
        return !this.isFalsy(keypath);
    }

    isSet(keypath) {
        const value = this.get(keypath);
        return (typeof value !== 'undefined' && value !== null);
    }

    get(keypath) {
        if(!keypath) return this.#data;
        return _.get(this.#data, keypath);
    }

    /**
     * Validates the data with a given schema.
     * @param {object} schema - The schema to validate with.
     * @throws {SchemaValidationError} - If the data is invalid.
     * @returns {boolean} Whether the data is valid.
     */
    validate(schema) {
        return validate(this.#data, schema, false)
    }
}

module.exports = Manifest;