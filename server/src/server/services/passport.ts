import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { randomBytes } from 'crypto';
import { users, Config, logger } from '../../zylax';

export default class PassportService {
    static initialize() {
        passport.use(
            new LocalStrategy(async (username, password, cb) => {
                const user = await users.UserController.findBy('username', username);

                try {
                    if (user && (await user.verifyPasswordTimeSafe(password))) {
                        return cb(null, user);
                    }
                } catch (err) {
                    logger.error(err);
                    return cb(null, false, { message: 'Something went wrong. See log for details.' });
                }

                return cb(null, false, { message: 'Incorrect username or password.' });
            }),
        );

        passport.serializeUser((user, cb) => {
            cb(null, user.id);
        });

        // Deserializing is handled by the userMiddleware middleware.
        passport.deserializeUser(async (userId, cb) => {
            const user = await users.UserController.find(userId);
            cb(null, user);
        });
    }

    static getOrCreateSecret() {
        let secret = Config.getOrFail('secret.webSessionSecret');

        if (!secret) {
            // Generate and store a new secret
            secret = randomBytes(32).toString('base64');
            Config.set('secret.webSessionSecret', secret);

            logger.debug('Generated a new web session secret, stored in config.');
        }

        return secret;
    }
}
