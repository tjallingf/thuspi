const _ = require('lodash');
const Controller = require('@/controllers/Controller');

class ControllerAsync extends Controller {
    static async index(doIncludePrivateKeypaths = true) {
        return Object.values(await this._indexObject(doIncludePrivateKeypaths));
    }

    static async indexBy(predicate, doIncludePrivateKeypaths = true) {
        return _.filter(await this.index(doIncludePrivateKeypaths), predicate);
    }

    static async find(keypath, doIncludePrivateKeypaths = true) {
        return _.get(await this._indexObject(doIncludePrivateKeypaths), keypath);
    }

    static async exists(keypath, doIncludePrivateKeypaths = true) {
        return (await this.find(keypath, doIncludePrivateKeypaths)) != undefined;
    }

    static async update(keypath, value) {
        return this.store(_.set(await this.index(), keypath, value));
    }
    

    static async _indexObject(doIncludePrivateKeypaths = true) {
        if(this._shouldPopulate()) this.store(await this._populate());

        if(!doIncludePrivateKeypaths)
            return _.omit(this.data || {}, this.privateKeypaths);
        
        return this.data || {};
    }

    static async _populate() {
        throw new Error('Method _populate() is not implemented.');
    }
}

module.exports = ControllerAsync;