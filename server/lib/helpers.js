const _ = require('lodash');
const uuidLib = require('uuid');

/**
 * Call's Promise.all(), but with an object instead of an array.
 * @param {object} object 
 * @returns {object}
 */
const PromiseAllObject = async (object) => {
    return _.zipObject(_.keys(object), await Promise.all(_.values(object)))
}

const uuid = () => {
    return uuidLib.v4().replaceAll('-', '');
}

/**
 * Explicitly returns the properties of an instance of EventEmitter.
 * @param {EventEmitter} eventEmitter 
 * @returns {object}
 */
const extractEventEmitter = (eventEmitter) => {
    return {
        on: eventEmitter.on,
        off: eventEmitter.off,
        once: eventEmitter.once,
        emit: eventEmitter.emit,
        addListener: eventEmitter.addListener,
        removeListener: eventEmitter.removeListener,
        removeAllListeners: eventEmitter.removeAllListeners,
        setMaxListeners: eventEmitter.setMaxListeners,
        getMaxListeners: eventEmitter.getMaxListeners,
        listeners: eventEmitter.listeners,
        listenerCount: eventEmitter.listenerCount
    }
}

module.exports = {
    PromiseAllObject,
    uuid,
    extractEventEmitter
}