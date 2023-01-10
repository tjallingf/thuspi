const _ = require('lodash');

class ManifestManager {
    data = {};

    constructor(data) {
        this.data = data;
    }

    isFalsy(keypath) {
        return !this.get(keypath);
    }

    isTruthy(keypath) {
        return !this.isFalsy(keypath);
    }

    get(keypath) {
        if(!keypath) return this.data;
        return _.get(this.data, keypath);
    }

    mergeWith(data) {
        this.data = _.merge(this.data, data);
    }
}

module.exports = ManifestManager;