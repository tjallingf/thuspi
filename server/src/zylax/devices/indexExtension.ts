import { Constructor } from '../types';
import type DeviceConnector from './DeviceConnector';
import type DeviceDriver from './DeviceDriver';
import registerModule from '../extensions/registerModule';

export function registerConnector(tag: string, callback: () => Constructor<DeviceConnector>) {
    registerModule(tag, callback);
}

export function registerDriver(tag: string, callback: () => Constructor<DeviceDriver>) {
    registerModule(tag, callback);
}

export { default as Device } from './Device';
export { default as DeviceConnectionConfig } from './DeviceConnectionConfig';
export { default as DeviceConnector } from './DeviceConnector';
export { default as DeviceController } from './DeviceController';
export { default as DeviceDriver } from './DeviceDriver';
export { default as DeviceState } from './DeviceState';
export { DeviceDriverManifest } from './DeviceDriver'