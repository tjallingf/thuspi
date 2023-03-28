const _ = require('lodash');
const uuidLib = require('uuid');

/**
 * Call's Promise.all(), but with an object instead of an array.
 * @param {object} object 
 * @returns {object}
 */
async function PromiseAllObject(object) {
    return _.zipObject(_.keys(object), await Promise.all(_.values(object)))
}

function uuid() {
    return uuidLib.v4().replaceAll('-', '');
}

function toJSON(value) {
    return typeof value == 'object' ? JSON.stringify(value) : value;
}

function fromJSON(value) {
    if(!isJSON(value)) return value;
    return JSON.parse(value);
}
 
function isJSON(value) {
    if(typeof value != 'string') return false;

    value = value.trim();
    if(value.startsWith('{') && value.endsWith('}')) return true;
    if(value.startsWith('[') && value.endsWith(']')) return true;
    
    return false;
}

module.exports = {
    PromiseAllObject,
    uuid,
    toJSON,
    fromJSON,
    isJSON
}