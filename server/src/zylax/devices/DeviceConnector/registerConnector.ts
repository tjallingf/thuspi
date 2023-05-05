import registerModule from '@/zylax/extensions/registerModule';
import { Constructor } from '@/zylax/types';
import type DeviceConnector from './DeviceConnector';

export default function registerConnector(name: string, callback: () => Constructor<DeviceConnector>) {
    registerModule(name, callback);
}
