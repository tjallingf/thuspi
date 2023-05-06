const mysql = require('mysql2');
const _ = require('lodash');
const { toJSON, fromJSON } = require('@/utils')

let connection;

const database = {
    connect: (credentials) => {
        connection = mysql.createConnection({
            host: credentials.host,
            user: credentials.user,
            port: credentials.port,
            password: credentials.password,
            database: credentials.database,
            connectionLimit: 10,
            maxIdle: 10,
            idleTimeout: 60000
        });

        LOGGER.debug(`Connected to database '${credentials.database}' as user '${credentials.user}'.`);
    },

    async query(sql, params = []) {
        // Encode JSON fields
        params = params.map(toJSON);

        return new Promise((resolve, reject) => {
            connection.execute(sql, params, (err, rows) => {
                if(err) throw err;

                // Decode JSON fields
                if(rows.constructor.name == 'Array') {
                    rows = rows.map(row => _.mapValues(row, fromJSON))
                    return resolve(rows);
                }

                return resolve();
            })
        })
    },

    escape(fields) {
        return connection.escape(_.mapValues(fields, toJSON));
    }
}

module.exports = database;