import ControllerDatabase from '../lib/ControllerDatabase';
import Database from '../lib/Database';
import User from '../users/User';
import { Config } from '../lib';
import * as _ from 'lodash';

export default class UserController extends ControllerDatabase<User>() {
    static table = 'users';
    static DEFAULT_USER_USERNAME = '__DEFAULT__';

    static async load() {
        let defaultUserRow;
        
        super.load(User, (row, rows) => {
            if(!defaultUserRow) {
                defaultUserRow = rows.find(row => row.username === this.DEFAULT_USER_USERNAME);  
                if(!defaultUserRow) {
                    throw new Error(`Cannot find default user. To resolve this issue, create a user with username '${this.DEFAULT_USER_USERNAME}'.`);
                }
            }

            return new User(row.id, _.defaultsDeep(row, defaultUserRow))
        })
    }
}