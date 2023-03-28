const Model = require('@/models/Model');

class ConnectionModel extends Model {
    options;
    isOpen = false;

    constructor(id, connectionOptions) {
        super(id, null, null, {
            // TODO: decrease max count
            maxListeners: 100
        });

        this.options = connectionOptions;
    }

    write() {
        LOGGER.error('Method write() is not implemented.');
    }

    read() {

    }
  
    /**
     * Should be called by the child instance when the connection is 
     * open for reading and/or writing.
     * @returns {ConnectionModel}
     */
    setOpened() {
        this.isOpen = true;
        this.emit('open');

        return this;
    }

    /**
     * Should be called by the child instance when the connection is 
     * no longer open for reading and/or writing.
     * @returns {ConnectionModel}
     */
    setClosed() {
        this.isOpen = false;
        this.emit('close');

        return this;
    }

    /**
     * Should be called by the child instance when a message is
     * received over the connection.
     * @param {any} message - The message that was received.
     * @returns {ConnectionModel}
     */
    handleData(message) {
        this.emit('data', message);

        return this;
    }
}

module.exports = ConnectionModel;