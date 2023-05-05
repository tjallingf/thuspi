import { EXTENSIONS_DIR } from '../constants';
import path from 'path';
import StackTrace from 'stacktrace-js';
import Manifest from '../utils/Manifest';
import ExtensionController from '../extensions/ExtensionController';
import { type Constructor } from '../types';
import type ExtensionModule from './ExtensionModule';

export function resolveExtensionFromStack() {
    const stack = getStack();
    const rootDir = path.join(EXTENSIONS_DIR, path.relative(EXTENSIONS_DIR, stack.fileName).split(path.sep)[0]);
    const packageFilepath = path.resolve(rootDir, './package.json');
    const packageManifest = Manifest.fromFileSync(packageFilepath);

    const name = packageManifest.get('name');
    const extension = ExtensionController.find(name);

    return extension;
}

export function resolveTypeClass(moduleClass: Constructor<ExtensionModule>) {
    return Object.getPrototypeOf(moduleClass);
}

export function getStack(): any {
    const trace = StackTrace.getSync();

    const stack = trace.find((stack) => stack.fileName.startsWith(EXTENSIONS_DIR));

    if (!stack) throw new Error('Failed to get extension call stack.');

    return stack;
}
