const Model = require('@/models/Model');

class DeviceConnector extends Model {
    idKey = 'id';

    connections = {};
    options;
    
    connect(options) {
        return new Promise((resolve, reject) => {
            this.options = options;
            if(!options[this.idKey])
                return reject(`No value is defined for key '${this.idKey}' in options.`);

            if(this.connections && this.connections[options[this.idKey]])
                return this.connections[options[this.idKey]];

            const result = this.create(options);
            if(!result instanceof Promise)
                return reject('Method create() must return a promise.');

            result.then(connection => {
                this.connections[options[this.idKey]] = connection;
                return resolve(connection);
            })
        })
    }

    async create(options) {
        throw new Error('Method create() is not implemented.');
    }
}

module.exports = DeviceConnector;