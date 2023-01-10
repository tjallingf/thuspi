const Model = require('@models/Model');
const _ = require('lodash');
const randomstring = require('randomstring');
const auth = require('passport-local-authenticate');
const path = require('path');
const fs = require('fs');

class UserModel extends Model {
    constructor(id, props, controller) {
        super(id, props, controller);

        return this;
    }

    hasPermission(permission) {
        const permissions = this.getProp('permissions');

        if(permissions[permission] != undefined)
            return (permissions[permission] === true);
        
        const parts = permission.split('.');
        for (let i = parts.length; i >= 0; i--) {
            const permissionWithWildcard = _.trimStart(parts.slice(0, i).join('.')+'.*', '.');

            if(permissions[permissionWithWildcard] != undefined)
                return (permissions[permissionWithWildcard] === true);
        }

        return false;
    }

    getSetting(setting) {
        return _.get(this.getProps(), `settings.${setting}`);
    }

    getPicturePath() {
        const filepath = path.join(DIRS.STATIC, 'users', 'pictures', this.id+'.jpg');
        if(!fs.existsSync(filepath)) return null;

        return filepath;
    }

    getSafeProps() {
        const safeProps = _.omit(this.getProps(), 'hashedPassword');

        const picturePath = this.getPicturePath();
        safeProps.hasPicture = !!picturePath;

        return safeProps;
    }

    async resetPassword(newPassword) {
        return new Promise((resolve, reject) => {
            auth.hash(newPassword, (err, hashed) => {
                if(err) return reject(err);

                this.setProps({
                    hashedPassword: hashed
                });

                return resolve(this);
            });
        })
    }

    generateRandomPassword() {
        return (
            randomstring.generate({ length: 1, charset: 'alphabetic', capitalization: 'uppercase' }) +
            randomstring.generate({ length: 2, charset: 'alphabetic', capitalization: 'lowercase' }) +
            randomstring.generate({ length: 5, charset: 'numeric' })
        );
    }

    verifyPasswordTimeSafe(password) {
        return new Promise((resolve, reject) => {
            const hashed = this.getProp('hashedPassword');

            auth.verify(password, hashed, function(err, isCorrect) {
                if(err) return reject(err);
                return resolve(isCorrect);
            });
        })
    }

    validate() {}
}

module.exports = UserModel;