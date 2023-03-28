class DeviceRecordingBuffer {
    #buffer = {};
    #fieldsConfig;
    #device;

    constructor(device, fieldsConfig = {}) {
        this.#device = device;
        this.#fieldsConfig = fieldsConfig;
    }

    setField(fieldId, value) {
        if(!this.#fieldsConfig[fieldId])
            throw new TypeError(`Field '${fieldId}' is not defined in fields config.`);
            
        this.#buffer[fieldId] = value;
    }

    clear() {
        this.#buffer = {};
    }

    read() {
        return this.#buffer;
    }
}

module.exports = DeviceRecordingBuffer;