// Load app
require('./lib/app');

const ip = require('ip');
const passportHelper = require('@lib/middlewares/passportHelper');
const errorMiddleware = require('@lib/middlewares/errorMiddleware');
const userMiddleware = require('@lib/middlewares/userMiddleware');
const RouteController = require('@controllers/RouteController');
const ExtensionController = require('@controllers/ExtensionController');
const ConfigController = require('@controllers/ConfigController');
const LogController = require('@controllers/LogController');
const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const app = express();

const SQLiteStore = require('connect-sqlite3')(session);

// The server must be started with root permissions
if(typeof process.getuid == 'function' && process.getuid() !== 0) {
    console.error('Cannot start without root permissions.');
    throw new Error('The server must be started with root permissions.');
}

// Force NODE_ENV to be either 'development' or 'production'
process.env.NODE_ENV = (process.env.NODE_ENV === 'development' ? 'development' : 'production');

// Check whether the server is running in development or production
if(process.env.NODE_ENV === 'production') {
    console.log(`Starting in mode 'production'...`);
} else {
    console.log(`Starting in mode 'development'...`);
}

// Index config and print message
console.log('Indexed', Object.keys(ConfigController.index()).length, 'config files.');

// Index extensions
console.log('Indexed', Object.keys(ExtensionController.index()).length, 'extensions.');

// Setup some middlewares
app.use(cookieParser());
app.disable('x-powered-by');
app.use(compression());
app.use(express.static('public'))
app.use(express.json())
app.use(cors());
app.use(session({
    secret: passportHelper.secret(),
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: path.join(DIRS.STORAGE, 'db') })
}));
app.use(passport.authenticate('session'));

// Setup middleware to fallback to the default
// user when the user is not signed in
app.use(userMiddleware);

// Initialize passport
passportHelper.init();

// Setup routes
RouteController.app = app;
console.log(`Indexed`, Object.keys(RouteController.index()).length, 'routes.');

// Setup error handler middelware
app.use(errorMiddleware);

// Get web port
const webPort = ConfigController.find('webClient.port') || 3000;

// Listen
app.listen(webPort, () => {
    Log.info(`Web client listening on port ${ip.address()}:${webPort}.`);
});

require('@lib/scripts/setupAppStartListener')();
require('@lib/scripts/setupAppEndListener')();

setTimeout(() => {
    require('@lib/scripts/setupRunFlowsJob')();
}, 5000);