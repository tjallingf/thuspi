const _ = require('lodash');

/**
 * Abstract Class Controller
 *
 * @class Controller
 */
class Controller {
    static data;
    static secretKeypaths = [];

    static shouldPopulate() {
        return this.data == undefined;
    }

    static updateIndex(newData) {
        this.data = newData;
        return this;
    }

    static index() {
        if(this.shouldPopulate()) this.updateIndex(this.populate());

        return this.data || {};
    }

    static find(keypath) {
        return _.get(this.index(), keypath);
    }

    static safeIndex() {
        return _.omit(this.index(), this.secretKeypaths);
    }

    static safeFind(keypath) {
        return _.get(this.safeIndex(), keypath);
    }

    static exists(keypath) {
        return this.find(keypath) != undefined;
    }

    static populate() {
        throw new Error('Method populate() is not implemented.');
    }

    static update(keypath, value) {
        return this.updateIndex(_.set(this.index(), keypath, value));
    }

    static handleUpdate(id) {
        throw new Error('Method handleUpdate() is not implemented.');
    }

    static handleDelete(id) {
        throw new Error('Method handleDelete() is not implemented.');
    }
}

module.exports = Controller;