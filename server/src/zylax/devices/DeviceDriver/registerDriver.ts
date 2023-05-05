import registerModule from '@/zylax/extensions/registerModule';
import { Constructor } from '@/zylax/types';
import type DeviceDriver from './DeviceDriver';

export default function registerDriver(name: string, callback: () => Constructor<DeviceDriver>) {
    registerModule(name, callback);
}
