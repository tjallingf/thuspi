import { objectGetValueByPath } from '../app/functions';

let __data = {};

const useConfig = (name, path) => {
    if(typeof __data[name] != 'object') return null;
    if(path == undefined) return __data[name];
    return objectGetValueByPath(__data[name], path);
}

const setConfig = (name, data) => {
    __data[name] = data;
}

export default useConfig;
export { setConfig };