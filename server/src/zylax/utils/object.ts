import _ from 'lodash';

// Convert {a: {b: 'value'}} to {'a.b': 'value'}
export function flattenKeys(obj: Object, seperator = '.', path: string[] = []): Record<string, any> {
    return !_.isObject(obj)
        ? { [path.join(seperator)]: obj }
        : _.reduce(obj, (cum, next, key) => _.merge(cum, flattenKeys(next, seperator, [...path, key])), {});
}
