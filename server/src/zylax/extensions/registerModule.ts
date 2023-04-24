import type Extension from './Extension';
import { Constructor } from '../types';
import ExtensionModule from './ExtensionModule';
import { resolveExtensionFromStack, resolveTemplate } from './utils';

export default function registerModule(tag: string, callback: (extension: Extension) => Constructor<ExtensionModule> | void) {
    const extension = resolveExtensionFromStack();
    const module = callback(extension) as Constructor<ExtensionModule>;

    if(!(module?.prototype instanceof ExtensionModule)) {
        extension.logger.error(`Failed to register module '${tag}': must extend ${ExtensionModule.name}, received ${module}.`);
        return;
    }

    extension.registerModule(tag, module);
}