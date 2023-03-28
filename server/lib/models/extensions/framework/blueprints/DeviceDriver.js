const Device = require('@/models/devices/Device');

class DeviceDriver {
    /** @type {Device} */
    device;
    
    /**
     * Creates a new instance.
     * @param {Device} device - The device that the driver works for.
     */
    constructor(device) {
        this.device = device;
    }

    async state() {
        return {
            isActive: Math.random() >= 0.5,
            display: {
                type: 'buttons',
                items: [
                    {
                        color: 'red',
                        icon: 'chevron-up'
                    }
                ]
            }
        }
    }
}

module.exports = DeviceDriver;