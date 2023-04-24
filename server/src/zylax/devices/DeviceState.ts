export interface DeviceStateDisplay {
    buttons?: DeviceStateDisplayButton[],
    tile?: DeviceStateDisplayTile,
    recording?: DeviceStateDisplayRecording
}

export interface DeviceStateDisplay {}

export interface DeviceStateDisplayButton extends DeviceStateDisplay {
    name: string,
    icon: string,
    color?: string,
    isActive?: boolean
}

export interface DeviceStateDisplayTile extends DeviceStateDisplay {
    title: string,
    thumbnailSrc?: string,
    description?: string
}

export interface DeviceStateDisplayRecording extends DeviceStateDisplay {
    field: string
}

export default class DeviceState {
    _isActive: boolean;
    _display: DeviceStateDisplay = {};

    get isActive() { return this._isActive; }

    /**
     * Set the active state.
     * @param isActive - Whether the device state should be active.
     */
    setIsActive(isActive: boolean): this {
        this._isActive = !!isActive;
        return this;
    }

    addButtonDisplay(display: DeviceStateDisplayButton[]) {
        this._display.buttons = display;
        return this;
    }

    addTileDisplay(display: DeviceStateDisplayTile) {
        this._display.tile = display;
        return this;
    }

    addRecordingDisplay(display: DeviceStateDisplayRecording) {
        this._display.recording = display;
        return this;
    }

    toJSON() {
        return {
            isActive: this._isActive,
            display: this._display
        }
    }
}