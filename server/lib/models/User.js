const ModelWithProps = require('@/models/ModelWithProps');
const _ = require('lodash');
const randomstring = require('randomstring');
const auth = require('passport-local-authenticate');
const ConfigController  = require('@/controllers/ConfigController');
const path = require('path');
const fs = require('fs');

const defaultUser = ConfigController.find('defaultUser');

class User extends ModelWithProps {
    constructor(id, props, controller) {
        const propsWithDefaults = _.defaultsDeep(props, defaultUser);
        super(id, propsWithDefaults, controller);

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
        const filepath = path.join(STATIC_DIR, 'users', 'pictures', this.id+'.jpg');
        if(!fs.existsSync(filepath)) return null;

        return filepath;
    }

    getSafeProps() {
        const safeProps = _.omit(this.getProps(), 'password');

        const picturePath = this.getPicturePath();
        safeProps.hasPicture = !!picturePath;

        return safeProps;
    }

    async resetPassword(newPassword) {
        return new Promise((resolve, reject) => {
            auth.hash(newPassword, (err, hashed) => {
                if(err) return reject(err);

                this.setProps({
                    password: hashed
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
            const hashed = this.getProp('password');

            auth.verify(password, hashed, function(err, isCorrect) {
                if(err) return reject(err);
                return resolve(isCorrect);
            });
        })
    }

    validate() {}
}

module.exports = User;