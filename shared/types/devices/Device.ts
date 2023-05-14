import type { DeviceStateDisplay } from './DeviceState';

export interface DeviceProps {
    name: string;
    icon: string;
    color: string;
    driver: {
        type: string;
        options: Record<string, any>
    };
    connection: {
        type: string;
        options: Record<string, any>
    },
    options: {
        recording: {
            enabled: boolean;
            cooldown: number;
            flushThreshold: number;
        };
    };
    metadata: Record<string, any>
}

export interface DevicePropsSerialized extends DeviceProps {
    id: number;
    state: {
        isActive: boolean,
        display: DeviceStateDisplay
    }
}