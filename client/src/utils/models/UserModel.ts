import Model from './Model';
import { trimStart } from 'lodash';

interface IUserProps {
    id: number,
    name: string
}

export default class UserModel extends Model {
    getSetting(id: string) {
        return this.getProp('settings')[id];
    }

    hasPermission(id: string) {
        const permissions = this.getProp('permissions');

        if(permissions[id] != undefined)
            return (permissions[id] === true);
        
        const parts = id.split('.');
        for (let i = parts.length; i >= 0; i--) {
            const idWithWildcard = trimStart(parts.slice(0, i).join('.')+'.*', '.');

            if(permissions[idWithWildcard] != undefined)
                return (permissions[idWithWildcard] === true);
        }

        return false;
    }
}