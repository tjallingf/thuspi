const ConfigController = require('@controllers/ConfigController');
const LogController = require('@controllers/LogController');
const UserController = require('@controllers/UserController');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { randomBytes } = require('crypto');

const passportInit = () => {
    passport.use(new LocalStrategy(async function verify(username, password, cb) {
        const user = UserController.findByUsername(username);
        if(!user) return cb(null, false, { message: 'Incorrect username or password.' });

        if(await user.verifyPasswordTimeSafe(password)) {
            return cb(null, user);
        } else {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }
    }));

    passport.serializeUser(function(user, cb) {
        cb(null, user?.id || 'default');
    });

    passport.deserializeUser(function(userId, cb) {
        return cb(null, UserController.find(userId || 'default') || UserController.find('default'));
    });
}

const sessionSecret = () => {
    const secret = ConfigController.find('secret.webSessionSecret');

    if(secret) return secret;

    // Generate and store a new secret if one has not been set
    const newSecret = randomBytes(32).toString('base64');
    ConfigController.update('secret.webSessionSecret', newSecret);
    
    Log.debug('Generated a new web session secret, stored in config.');

    return newSecret;
}

module.exports = { init: passportInit, secret: sessionSecret };