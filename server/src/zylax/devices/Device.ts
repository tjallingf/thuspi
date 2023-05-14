import DeviceConnector from './DeviceConnector/DeviceConnector';
import DeviceDriver from './DeviceDriver/DeviceDriver';
import ExtensionController from '../extensions/ExtensionController';
import ModelWithProps from '../lib/ModelWithProps';
import WebSocket from '../lib/WebSocket';
import DeviceController from './DeviceController';
import Manifest from '../utils/Manifest';
import RecordManager from '../records/RecordManager';
import _ from 'lodash';
import type { DeviceProps, DevicePropsSerialized } from '~shared/types/devices/Device';
import type { ModelWithPropsConfig } from '../lib/ModelWithProps';

export default class Device extends ModelWithProps<DeviceProps, DevicePropsSerialized> {
    _getConfig(): ModelWithPropsConfig<DeviceProps, DevicePropsSerialized> {
        return {
            controller: DeviceController,
            filterProps: {
                name: false
            },
            dynamicProps: {
                connection: () => {
                    return {
                        exists: true,
                        isOpen: true
                    }
                },
                state: () => {
                    if(this.driver) {
                        return this.driver.getState().toJSON();
                    }
                    
                    return {
                        isActive: false,
                        display: {}
                    }
                }
            },
            defaults: {
                name: 'test',
                icon: 'test',
                color: 'red',
                driver: {
                    type: null,
                    options: {}
                },
                connector: {
                    type: null,
                    options: {}
                },
                options: {
                    recording: {
                        enabled: false,
                        cooldown: 5,
                        flushThreshold: 5
                    }
                },
                metadata: {}
            }
        }
    }

    private _driver: DeviceDriver | void;
    get driver() {
        return this._driver;
    }

    private _driverManifest: Manifest | null = null;
    get driverManifest() {
        return this._driverManifest;
    }

    private _connection: DeviceConnector | null = null;
    get connection() {
        return this._connection;
    }

    private _records: RecordManager;
    get records() {
        return this._records;
    }

    init() {
        try {
            this.initRecordManager();

            if (!this.initDriver()) {
                this.logger.debug('Driver not initialized, not initializing connection.');
                return;
            }

            this.initConnector();
        } catch (err: any) {
            this.logger.error(err);
        }
    }

    async handleInput(name: string, value: any): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this._driver || !this._driverManifest) {
                    throw new Error('No driver initialized.');
                }

                if (!this._connection) {
                    throw new Error('No connection initialized.');
                }

                if (!this._driverManifest.get('inputs').some((i: any) => i.name === name)) {
                    throw new Error(`${this._driver} does not have an input named '${name}'.`);
                }

                if (!this._connection?.isOpen) {
                    throw new Error('Cannot handle input because the connection is closed.');
                }

                this.logger.debug(`Changing value of input '${name}'.`, { meta: { value } });
                this._driver.handleInput(name, value, (err) => {
                    if (err) throw err;

                    this.emitClientUpdate();
                    resolve();
                });
            } catch (err) {
                return reject(err);
            }
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

        if (typeof driverConfig?.type != 'string') {
            this.logger.notice('No driver configured.');
            return false;
        }

        const DriverModule = ExtensionController.findModule(DeviceDriver, driverConfig.type);
        this._driver = new DriverModule(this);
        this._driverManifest = new Manifest(this._driver.manifest);

        if (this.getOption('recording.enabled') && this._driverManifest.get('recording.supported') === false) {
            this.logger.warn(
                `Option 'recording.enabled' is set to true, but ${this._driver} does not support recording.`,
            );
        }

        return true;
    }

    protected initRecordManager(): void {
        this._records = new RecordManager(this);
    }

    /**
     * Initializethe connection.
     */
    protected initConnector(): boolean {
        if (!this._driver) {
            throw new Error('Cannot initialize connection when no driver is initialized.');
        }

        let connConfig = this.getProp('connector');

        // Invoke the driver's modifyConnectionConfig() to edit the connection config.
        this.logger.debug('Calling device driver to edit the connection configuration.');
        const editedConnConfig = this._driver.modifyConnectorConfig(connConfig);

        if (typeof editedConnConfig?.type != 'string') {
            this.logger.notice('No connector configured.');
            return false;
        }

        const ConnectionModule = ExtensionController.findModule(DeviceConnector, editedConnConfig.type);

        const connection = new ConnectionModule(this, editedConnConfig);

        connection.on('create', () => {
            this.logger.debug('Connection created.');
            this._connection = connection;
            this.emitClientUpdate();

            this.emit('connection:create');
        });

        connection.on('destroy', () => {
            this.logger.debug('Connection destroyed.');
            this._connection = null;
            this.emitClientUpdate();

            this.emit('connection:destroy');
        });

        // Add listeners
        connection.on('open', () => {
            this.logger.debug('Connection open.');
            this.emitClientUpdate();

            this.emit('connection:open');
        });

        connection.connect();

        return true;

        // connector.invoke('connect', [ connConfig ]).then(connection: DeviceConnection => {
        //     this._connection = connection;

        //     // Add event listeners
        //     connection.on('open', () => this.logger.debug('Connection was opened.'));
        //     connection.on('close', () => this.logger.debug('Connection was closed.'));

        //     // Emit the 'connect' event
        //     this.emit('connect');
        // }).catch(err => {
        //     this.logger.error(err);
        // });
    }

    /**
     * Sends an update to the web client.
     */
    emitClientUpdate() {
        (async () => {
            WebSocket.emit('devices:change', {
                device: await this.addDynamicProps(this.getProps()),
            });
        })();
    }
}
