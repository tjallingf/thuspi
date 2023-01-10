import Model from './Model';
import { trimStart } from 'lodash';

class UserModel extends Model {
    constructor(props) {
        return super(props);
    }

    hasPermission(permission) {
        const permissions = this.getProp('permissions');

        if(permissions[permission] != undefined)
            return (permissions[permission] === true);
        
        const parts = permission.split('.');
        for (let i = parts.length; i >= 0; i--) {
            const permissionWithWildcard = trimStart(parts.slice(0, i).join('.')+'.*', '.');

            if(permissions[permissionWithWildcard] != undefined)
                return (permissions[permissionWithWildcard] === true);
        }

        return false;
    }

    getSetting(setting) {
        return this.getProp('settings')[setting];
    }
}

export default UserModel;