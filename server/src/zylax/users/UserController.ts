import ControllerDatabase from '../lib/DatabaseController';
import Database from '../lib/Database';
import User from '../users/User';
import { Config } from '../lib';
import * as _ from 'lodash';

export default class UserController extends ControllerDatabase<User>() {
    static table = 'users';
    protected static DEFAULT_USER_USERNAME: string;

    static test() {
        return {
            a: 5
        }
    }

    static findDefaultUser() {
        return this.findBy(u => u.getProp('username') === this.DEFAULT_USER_USERNAME);
    }

    static a() {
        return {
            b: 45
        }
    }

    static async load() {
        this.DEFAULT_USER_USERNAME = Config.get('system.users.defaultUser');

        super.load(User, (row, rows) => {
            const defaultUserRow = rows.find((row) => row.username === this.DEFAULT_USER_USERNAME);
            
            if (!defaultUserRow) {
                throw new Error(
                    `Cannot find default user. To resolve this issue, create a user with username '${this.DEFAULT_USER_USERNAME}'.`,
                );
            }

            return new User(row.id, _.defaultsDeep(row, defaultUserRow));
        });
    }
}
