const _ = require('lodash');
const Model = require('@/models/Model');

class Controller {
    static data;
    static privateKeypaths = [];
    static doExcludeInvalid = false;

    static index(doIncludePrivateKeypaths = true) {
        return Object.values(this._indexObject(doIncludePrivateKeypaths));
    }

    static indexBy(predicate, doIncludePrivateKeypaths = true) {
        return _.filter(this.index(doIncludePrivateKeypaths), predicate);
    }

    static find(keypath, doIncludePrivateKeypaths = true) {
        return _.get(this._indexObject(doIncludePrivateKeypaths), keypath);
    }

    static exists(keypath, doIncludePrivateKeypaths = true) {
        return this.find(keypath, doIncludePrivateKeypaths) != undefined;
    }

    static update(keypath, value) {
        return this.store(_.set(this._indexObject(), keypath, value));
    }

    static store(newData) {
        if(this.doExcludeInvalid) {
            newData = _.pickBy(newData, model => {
                if(!model instanceof Model) return true;
                return !model.isInvalid;
            }) 
        }

        this.data = newData;

        return this;
    }
    
    static _indexObject(doIncludePrivateKeypaths = true) {
        if(this._shouldPopulate()) this.store(this._populate());

        if(!doIncludePrivateKeypaths)
            return _.omit(this.data || {}, this.privateKeypaths);
        
        return this.data || {};
    }

    static _shouldPopulate() {
        return this.data == undefined;
    }

    /**
     * Fetches data from the filesystem or database.
     * @returns {array} The data.
     */
    static _populate() {
        throw new Error('Method _populate() is not implemented.');
    }

    static _mapModel(rows, model) {
        return Object.fromEntries(_.map(rows, props => 
            [ props.id, new model(props.id, props, this) ]))
    }
}

module.exports = Controller;