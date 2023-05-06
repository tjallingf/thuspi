import type Extension from './Extension';
import { Constructor } from '../types';
import ExtensionModule from './ExtensionModule';
import { resolveExtensionFromStack, resolveTypeClass } from './utils';
import _ from 'lodash';

export default function registerModule<T extends ExtensionModule>(
    name: string,
    callback: (extension: Extension) => Constructor<T>,
    validate?: (prototype: T, moduleClass: Constructor<T>) => boolean | string | Error | void | Constructor<T>,
) {
    const extension = resolveExtensionFromStack();
    let moduleClass = callback(extension);

    // Validate the module before passing it to the extension
    try {
        if (!(moduleClass?.prototype instanceof ExtensionModule)) {
            extension.logger.error(
                `Failed to register module '${name}': must extend ${ExtensionModule.name}, received ${module}.`,
            );
            return;
        }

        // Resolve the type of module (i.e. FlowBlock, DeviceDriver)
        var typeClass = resolveTypeClass(moduleClass);

        if (typeof validate === 'function') {
            var result = validate(moduleClass.prototype as T, moduleClass);
        }
    } catch (err) {
        result = err;
    }

    // If the validator returns the same type of module, replace the current module.
    if (typeof result === typeof moduleClass && result !== moduleClass) {
        extension.logger.notice(
            `${typeClass.name} '${name}' was replaced by the validator as it returned a module of the same type.`,
        );
        moduleClass = result as Constructor<T>;
    } else if (result === false || typeof result === 'string' || result instanceof Error) {
        let formattedResult = 'reason unknown';
        if (typeof result === 'string') {
            formattedResult = _.trimEnd(result, '.');
        } else if (result === false) {
            formattedResult = 'returned false';
        } else if (result instanceof Error) {
            formattedResult = result.message;
        }

        extension.logger.error(`${typeClass.name} '${name}' did not validate: ${formattedResult}.`);
        return;
    }

    extension.registerModule(name, moduleClass, typeClass);
}
