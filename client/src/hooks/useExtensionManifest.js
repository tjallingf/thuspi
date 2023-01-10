import { get } from 'lodash';
// import { ExtensionModel } from '../app/models/ExtensionModel';

let __extensions;

const useExtensionManifest = (extensionId, itemName) => {
    const itemKeypath = itemName.replaceAll('/', '.items.');
    const fullKeypath = `${extensionId}.${itemKeypath}.items.manifest`;
    const manifest = get(__extensions, fullKeypath);
    
    if(manifest == undefined)
        throw new Error(`No manifest found for item '${itemName}' in extension '${extensionId}'.`);

    return manifest.contents;
}

const ExtensionManifestProvider = ({ extensions, children }) => {
    // __extensions = mapValues(extensions, extension => new ExtensionModel(extension));
    __extensions = extensions;
    return children;
}

export default useExtensionManifest;
export { useExtensionManifest, ExtensionManifestProvider };