import * as _ from 'lodash';

/**
 * Similar to Promise.all(), but with an object instead of an array.
 */
async function PromiseAllObject(object: Object): Promise<Object> {
    return _.zipObject(_.keys(object), await Promise.all(_.values(object)))
}

async function PromiseAllSettledObject(object: Object): Promise<Object> {
    return _.zipObject(_.keys(object), await Promise.allSettled(_.values(object)))
}


export { PromiseAllObject, PromiseAllSettledObject };
