import ExtensionModule from '../../extensions/ExtensionModule';
import DeviceState from '../DeviceState';
import Device from '../Device';
import type DeviceConnectionConfig from '../DeviceConnectionConfig';

export type DeviceDriverManifestInputType = 'toggle' | 'color' | 'open' | 'close' | 'stop';
export interface DeviceDriverManifest {
    recording?: {
        supported?: boolean;
        fields?: Array<{
            name: string;
            type: string;
            color?: string;
            primary?: boolean;
        }>;
    };
    inputs?: Array<{
        name: string;
        type: DeviceDriverManifestInputType;
    }>;
}

export default class DeviceDriver extends ExtensionModule {
    device: Device;
    options: any;
    manifest: DeviceDriverManifest;

    /**
     * Create a new instance.
     * @param device - The device that the driver works for.
     */
    constructor(device: Device) {
        super();

        this.device = device;
        this.options = this.device.getProp('driver.options') || {};
        this.manifest = this.createManifest();

        this.setup();
    }

    /**
     * Is called once to allow for setting up any event listeners.
     */
    setup(): void {}

    createManifest(): DeviceDriverManifest {
        return {};
    }

    /**
     * Create a DeviceState representing the current state of the device.
     * @returns The current state.
     */
    getState(): DeviceState {
        const state = new DeviceState();

        state.setIsActive(false);

        return state;
    }

    /**
     *
     * @param {DeviceConnectionConfig} current - The current connection config.
     * @returns The modified connection config.
     */
    modifyConnectionConfig(current: DeviceConnectionConfig): DeviceConnectionConfig {
        return current;
    }

    /**
     * Check whether the driver has an input of a specific type.
     * @param type - The type of the input to find.
     * @returns Whether the driver has an input of that type.
     */
    hasInputOfType(type: DeviceDriverManifestInputType) {
        if (!this.manifest?.inputs?.length) return false;
        return this.manifest.inputs.some((i) => i.type === type);
    }

    /**
     * @param name - The name of the input to write.
     * @param value - The value to write.
     * @param callback - The callback to call when the value is set.
     */
    handleInput(name: string, value: any, callback: (err?: Error) => any): void {
        callback();
    }
}
