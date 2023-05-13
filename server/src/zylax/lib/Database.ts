import * as _ from 'lodash';
import * as mysql from 'mysql2';
import { logger } from './Logger';

export interface IDatabaseCredentials {
    host: string,
    user: string,
    port: number,
    password: string,
    database: string
}

export interface IDatabaseFields {
    [key: string]: any
}

class Database {
    static connection: mysql.Connection;

    static connect(credentials: IDatabaseCredentials) {
        this.connection = mysql.createConnection({
            host: credentials.host,
            user: credentials.user,
            port: credentials.port,
            password: credentials.password,
            database: credentials.database
        });
    }

    static async query(sql: string, params : any[]= []): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.connection.execute(sql, params, (err, rows: any[]) => {
                if(err) return reject(err);

                if(!_.isArray(rows))
                    return resolve([]);
                
                // Decode JSON fields
                rows = rows.map(row => _.mapValues(row, value => {
                    try {
                        return JSON.parse(value);
                    } catch(err) {
                        return value;
                    }
                }))
                
                return resolve(rows);
            })
        })
    }

    static serializeFields(fields: IDatabaseFields): string {
        const encodedFields = _.mapValues(fields, (v, k) => _.isObjectLike(v) ? JSON.stringify(v) : v);
        return this.connection.escape(encodedFields);
    }

    static escapeSQLWord(word: string) {
        return word.replace(/[^a-zA-Z0-9_$-]+/g, '');
    }
}

export default Database;