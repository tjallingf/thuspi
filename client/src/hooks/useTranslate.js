import { isArray } from 'lodash';

let __translations;

const useTranslate = (key, replacements, extensionId = 'core') => {
    if(__translations[extensionId] == undefined)
        return console.warn(`Extension '${extensionId}' does not support this locale.`);

    if(__translations[extensionId][key] == undefined)
        return console.warn(`Extension '${extensionId}' does not provide a translation for '${key}' in this locale.`);

    let translation = __translations[extensionId][key];
    
    if(isArray(replacements)) {
        // Loop over the replacements in reverse order, to prevent
        // replacing %10, %11, %12, etc. with the value for %1
        for (let i = replacements.length-1; i >= 0; i--) {
            const value = replacements[i];
            translation = translation.replace('%'+i, value);
        }
    }
        
    return translation;
}

const TranslateProvider = ({ translations, children }) => {
    __translations = translations;
    return children;
}

export default useTranslate;
export { useTranslate, TranslateProvider };