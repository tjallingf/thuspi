import { nthIndexOfStr } from './functions';

let _currentUserData;

function setData(userdata) {
    _currentUserData = userdata;
    return true;
}
    
function hasPermission(perm) {
    if(typeof perm != 'string')
        return false;

    const userPerms = _currentUserData?.permissions || {};

    if(typeof userPerms != 'object' || !userPerms.length === 0) 
        return false;

    // check if 'perm' is defined on 'userPerms'
    if(typeof userPerms[perm] !== 'undefined')
        return (userPerms[perm] === true);

    // get number of seperators (.) in permission string
    const numberOfSeperators = (perm.match(/\./g) || []).length;

    // 'perm' is not defined on 'userPerms', 
    // check if it exists when using wildcards
    let hasPerm = false;
    for (let i = 0; i <= numberOfSeperators; i++) {
        // replace last section of 'perm' with an asterisk
        const permWithWildcard = perm.slice(0, nthIndexOfStr(perm, '.', i) + 1) + '*';

        if(typeof userPerms[permWithWildcard] !== 'undefined') {
            hasPerm = (userPerms[permWithWildcard] === true);
            break;
        }    
    }

    return hasPerm;
}

function hasPermissions(perms) {
    return perms.every(perm => currentUser.hasPermission(perm)) === true;
}

function getSetting(name) {
    return false;
}

export { setData, hasPermission, hasPermissions, getSetting };