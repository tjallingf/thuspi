import DeviceConnectionConfig, { IDeviceConnectionConfig } from './DeviceConnectionConfig';
import DeviceConnector from './DeviceConnector';
import DeviceDriver from './DeviceDriver';
import ExtensionController from '../extensions/ExtensionController';
import ModelWithProps from '../lib/ModelWithProps';
import WebSocket from '../lib/WebSocket';
import DeviceController from './DeviceController';
import Manifest from '../utils/Manifest';
import RecordManager from '../records/RecordManager';
import _ from 'lodash';

export interface DeviceProps {
    id: number,
    name: string,
    icon: string,
    color: string,
    driver: {
        type: string,
        options: {
            [key: string]: any
        }
    },
    options: {
        recording?: {
            enabled?: boolean
        }
    }
    connection: IDeviceConnectionConfig,
    metadata: {
        [key: string]: any
    }
}

export default class Device extends ModelWithProps<DeviceProps> {
    static cnf = {
        dynamicProps: [ 'state', 'connection' ],
        hiddenProps: [ 'driver' ],
        controller: DeviceController
    }

    private driver: DeviceDriver;
    private driverManifest: Manifest;

    public connection: DeviceConnector;
    public records: RecordManager;

    init() {
        try {
            (() => {
                this.initRecordManager();

                if(!this.initDriver()) {
                    this.logger.debug('Driver not initialized, not initializing connection.');
                    return;
                }

                this.initConnection();
            })();
        } catch(err) {
            this.logger.error(err);
        }
    }

    async handleInput(name: string, value: any): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if(!this.connection?.isOpen) {
                const err = new Error('Cannot handle input because the connection is closed.');
                this.logger.error(err);
                return reject(err);
            }

            this.logger.debug(`Changing value of input '${name}'.`, { meta: { value } });
            this.driver.handleInput(name, value, (err) => {
                if(err) 
                    return reject(err);

                this.emitClientUpdate();
                resolve();
            })
        });
    }
    
    /**
     * Get the value of an option.
     * @param keypath - The key of the option to get.
     * @returns The value of the option.
     */
    getOption(keypath: string) {
        return _.get(this.getProp('options'), keypath);
    }

    /**
     * Get the value of metadata property at keypath.
     * @param keypath - The keypath of the metadata property to get.
     * @returns The value of the metadata property.
     */
    getMetadata(keypath: string) {
        return _.get(this.getProp('metadata'), keypath);
    }
    
    /**
     * Set the value of metadata property at keypath.
     * @param keypath - The keypath of the metadata property to set.
     * @param value - The value to set.
     */
    setMetadata(keypath: string, value: any) {
        return this.setProp(`metadata.${keypath}`, value);
    }
    
    /**
     * Initialize the driver.
     */
    protected initDriver(): boolean {
        const driverConfig = this.getProp('driver');

        if(typeof driverConfig?.type != 'string') {
            this.logger.notice('No driver configured.');
            return false;
        }

        const DriverModule = ExtensionController.findModule<DeviceDriver>(DeviceDriver.name, driverConfig.type);
        this.driver = new DriverModule(this);
        this.driverManifest = new Manifest(this.driver.getManifest());

        if(this.getOption('recording.enabled') && this.driverManifest.get('recording.supported') === false) {
            this.logger.warn(`Option 'recording.enabled' is set to true, but ${this.driver} does not support recording.`);
        }

        return true;
    }

    protected initRecordManager(): void {
        this.records = new RecordManager(this);
    }

    /**
     * Initializethe connection.
     */
    protected initConnection(): void {
        let connConfig = new DeviceConnectionConfig(this.getProp('connection'));

        // Invoke the driver's modifyConnectionConfig() to edit the connection config.
        this.logger.debug('Calling device driver to edit the connection configuration.');
        const editedConnConfig = this.driver.modifyConnectionConfig(connConfig);

        // Only update the connection config if a new config was returned.
        if(editedConnConfig instanceof DeviceConnectionConfig)
            connConfig = editedConnConfig;

        if(!connConfig.isSet()) {
            this.logger.notice('No connection config supplied, not initializing a connection.');
            return;
        }

        const ConnectionModule = ExtensionController.findModule<DeviceConnector>(DeviceConnector.name, connConfig.getType());
        
        const connection = new ConnectionModule(this, connConfig);
        
        connection.on('create', () => {
            this.logger.debug('Connection created.');
            this.connection = connection;
            this.emitClientUpdate();

            this.emit('connection:create');
        })

        connection.on('destroy', () => {
            this.logger.debug('Connection destroyed.');
            this.connection = null;
            this.emitClientUpdate();

            this.emit('connection:destroy');
        })

        // Add listeners
        connection.on('open', () => {
            this.logger.debug('Connection open.');
            this.emitClientUpdate();

            this.emit('connection:open');
        })
        
        connection.connect();

        // connector.invoke('connect', [ connConfig ]).then(connection: DeviceConnection => {
        //     this.connection = connection;

        //     // Add event listeners
        //     connection.on('open', () => this.logger.debug('Connection was opened.'));
        //     connection.on('close', () => this.logger.debug('Connection was closed.')); 

        //     // Emit the 'connect' event
        //     this.emit('connect');
        // }).catch(err => {
        //     this.logger.error(err);
        // });
    }

    async prop_state() {
        return this.driver ? this.driver.getState().toJSON() : null;
    }

    async prop_connection() {
        return {
            isCreated: (this.connection instanceof DeviceConnector),
            isOpen: (!!this.connection?.isOpen)
        }
    }

    /**
     * Sends an update to the web client.
     */
    emitClientUpdate() {
        (async () => {
            WebSocket.emit('devices:change', {
                device: await this.addDynamicProps(this.getProps())
            })
        })();
    }
}