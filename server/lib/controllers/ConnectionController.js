const Controller = require('@/controllers/Controller');
const Device = require('@/models/devices/Device');
const Connection = require('@/models/Connection');
const _ = require('lodash');

/**
 * @type connect_callback
 * 
 */

class ConnectionController extends Controller {   
    static idKey = 'id';

    // A connection controller should never update by default
    static _shouldPopulatelate() {
        return false;
    }

    /**
     * 
     * @throws {Error}
     * @param {object} options - The options that should be used for connecting.
     * @returns {Connection} - The connection.
     */
    static async findOrCreate(options) {
        if(!_.isPlainObject(options) || typeof options[this.idKey] == 'undefined')
            throw new Error('Invalid connection options.');

        // Check if a connection already exists
        let connection = this.find(options[this.idKey]);

        // If not, create a new one
        if(!(connection instanceof Connection)) {
            connection = this.create(options);

            if(connection instanceof Connection)
                this.update(options[this.idKey], connection);
        }
        
        if(!(connection instanceof Connection))
            throw new Error('Failed to create connection.');

        return connection;
    }

    /**
     * Creates a new Connection.
     * @param {string} id - A string to uniquely identify the connection in the controller.
     * @param {object} options - The options that should be passed into the constructor.
     */
    static create(options, type = null) {
        if(typeof type != 'string')
            return new Connection(options[this.idKey], options);
        
        const [ extId, folderId ] = type.split('/');
        const ext = ExtensionController.find(extId);
        const manifest = ext.getFile([ DEVICES.CONNECTION_DRIVERS, folderId, 'manifest' ]).getContents();
        const controller = ext.getFile(manifest.controller);
        
        return controller.create(options);
    }

    /**
     * Finds a connection.
     * @param {string} id - The id of the connection to find.
     * @returns {Connection|null} The connection.
     */
    static find(id) {
        const connection = super.find(id);
        return connection instanceof Connection ? connection : null;
    }
}

/**
 * @callback setup_onSuccess
 * @param {Connection} connection - The connection.
 * @returns {void}
*/

module.exports = ConnectionController;