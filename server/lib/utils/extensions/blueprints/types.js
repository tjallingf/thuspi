const DeviceDriver = require('@/models/extensions/framework/blueprints/DeviceDriver');
const DeviceConnector = require('@/models/extensions/framework/blueprints/DeviceConnector');
const DeviceConnection = require('@/models/extensions/framework/blueprints/DeviceConnection');

/** 
 * The types of modules that can be defined
 */
const types = {
    /** A DeviceConnection manages reading from and writing to a Device. */
    DeviceConnection,

    /** A DeviceConnector manages DeviceConnections. */
    DeviceConnector,
    
    /** A DeviceDriver manages the communication between a DeviceConnection and the system. */
    DeviceDriver
}

module.exports = types;