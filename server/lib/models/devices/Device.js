const ModelWithProps = require('@/models/ModelWithProps');
const ExtensionController = require('@/controllers/ExtensionController');
const ExtensionModule = require('@/models/extensions/ExtensionModule');
const { DEVICE_DRIVER, DEVICE_CONNECTOR } = require('@/utils/extensions/blueprints/typeNames');
const Manifest = require('@/models/Manifest');
const DeviceRecordingBuffer = require('@/models/devices/DeviceRecordingBuffer');
const DeviceConnectionWrapper = require('@/models/devices/DeviceConnectionWrapper');
const io = require('@/io');

class Device extends ModelWithProps {
    /** @type {ExtensionModule} */
    driver;

    /** @type {DeviceRecordingBuffer} */
    #recordingBuffer;

    /** @type {DeviceConnectionWrapper} */
    #connection;

    /**
     * @param {int} id
     * @param {object} props
     * @param {Controller} controller
     * @returns {this}
     */
    constructor(id, props, controller) {
        super(id, props, controller, {
            enableLogger: true,
            asyncProps: [ 'state' ],
            hiddenProps: [ 'metadata' ]
        });

        this._initDriver();
        this._initConnection();
        // this._initRecordingBuffer();
    }

    /**
     * Returns the connection of the device.
     * @returns {DeviceConnectionWrapper}
     */
    get connection() {
        if(!this.#connection instanceof DeviceConnectionWrapper)
            throw new Error('No connection available.');

        return this.#connection;
    }

    async handleInput(name, value) {
        return new Promise(async (resolve, reject) => {
            const args = [{
                name, value
            }];

            // Check if the connection is open before writing
            if(!this.connection.isOpen()) {
                this.logger.error('Cannot handle input because the connection is closed.');
                return reject('Cannot handle input because the connection is closed.');
            }

            if(!this.driver.hasMethod('handleInput')) {
                this.logger.error('Cannot handle input because driver does not support it.');
                return reject('Cannot handle input because driver does not support it.');
            }

            this.logger.debug(`Changing value of input '${name}'.`, { value });
            this.driver.invoke('handleInput', args).then(() => {
                this.emitClientUpdate();
                resolve(); 
            })
        });
    }

    async handleData(message) {
        return new Promise((resolve, reject) => {
            const args = [{
                device:  this,
                message: message
            }];

            const file = this.driverExt?.getFile([ this.driverNamespace, 'handle-data']);
            if(!file) {
                this.logger.notice('Data was received, but no data handler can be found.');
                return reject('Data was received, but no data handler can be found.');
            }

            file.execute(args).then(resolve).catch(reject);
        })
    }

    /**
     * Returns the recording buffer of the device.
     * @returns {DeviceRecordingBuffer}
     */
    recordingBuffer() {
        return this.#recordingBuffer;
    }

    /**
     * Gets the value of metadata property at keypath.
     * @param {string} keypath - The keypath of the metadata property to get.
     * @returns {any} - The value of the metadata property.
     */
    getMetadata(keypath) {
        return this.getProp(`metadata.${keypath}`);
    }
    
    /**
     * Sets the value of metadata property at keypath.
     * @param {string} keypath - The keypath of the metadata property to set.
     * @param {any} value - The value to set.
     * @returns {this}
     */
    setMetadata(keypath, value) {
        return this.setProp(`metadata.${keypath}`, value);
    }
    
    /**
     * Initializes the driver.
     * @returns {void}
     */
    _initDriver() {
        const driverConfig = this.getProp('driver');
        if(typeof driverConfig?.type != 'string') {
            this.logger.notice('No driver configured.');
            return;
        }

        const args = [ this ];

        this.driver = ExtensionController.findModule(DEVICE_DRIVER, driverConfig.type).init(args);
    }

    _initRecordingBuffer() {
        const fieldsConfig = this.driverManifest.get('recording.fields')
        this.#recordingBuffer = new DeviceRecordingBuffer(this, fieldsConfig);
    }

    /**
     * Initializes the connection.
     * @returns {void}
     */
    async _initConnection() {
        const config = this.getProp('connection');
        if(typeof config?.type != 'string') {
            this.logger.notice('No connection configured.');
            return;
        }

        const connector = ExtensionController.findModule(DEVICE_CONNECTOR, config.type).init();
        
        connector.invoke('connect', [ config.options ]).then(connection => {
            this.#connection = new DeviceConnectionWrapper(connection);

            connection.on('open', () => this.logger.debug('Connection was opened.'));
            connection.on('close', () => this.logger.debug('Connection was closed.')); 

            // Emit the 'connect' event
            this.emit('connect');
        }).catch(err => {
            this.logger.error(err);
        });
    }

    _validate({ error, notice }) {
        // Check for driver-related issues (only if a driver is specified)
        if(this.driverNamespace != false) {
            if(!(this.driverExt instanceof Extension))
                return error('Cannot find driver extension.');

            if(!(this.driverManifest instanceof Manifest))
                return error('Cannot find driver manifest.');
        } else {
            notice('No driver specified.');
        }
    }

    async _stateProp() {
        if(!this.driver.hasMethod('getState')) return {};
        return this.driver.invoke('getState');
    }

    /**
     * Sends an update to the client.
     */
    emitClientUpdate() {
        (async () => {
            io.get().emit('devices:change', {
                device: await this.getPropsWithAsync()
            })
        })();
    }
}

module.exports = Device;