const ip = require('ip');
const express = require('express');
require('express-async-errors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const session = require('express-session');
const passportWrapper = require('@/middleware/passportWrapper');
const errorMiddleware = require('@/middleware/errorMiddleware');
const userMiddleware = require('@/middleware/userMiddleware');
const apiMiddleware = require('@/middleware/apiMiddleware');
const RouteController = require('@/controllers/RouteController');
const passport = require('passport');
const path = require('path');
const app = express();
const ConfigController = require('@/controllers/ConfigController');
const SQLiteStore = require('connect-sqlite3')(session);
const io = require('@/io');

const start = () => {
    // Setup some middlewares
    app.use(cookieParser());
    app.disable('x-powered-by');
    app.use(compression());
    app.use(express.static('public'))
    app.use(express.json())
    app.use(cors());
    app.use(session({
        secret: passportWrapper.secret(),
        resave: false,
        saveUninitialized: false,
        store: new SQLiteStore({ db: 'sessions.db', dir: path.join(STORAGE_DIR, 'db') })
    }));
    app.use(passport.authenticate('session'));

    // Setup middleware to fallback to the default
    // user when the user is not signed in
    app.use(userMiddleware);
    app.use(apiMiddleware);

    // Initialize passport
    passportWrapper.init();

    // Setup routes
    RouteController.app = app;
    LOGGER.info(`Loaded ${RouteController.index().length} routes.`);

    // Setup error handler middelware
    app.use(errorMiddleware);
}
    // Get web port
    const webPort = ConfigController.find('system.webClient.port') || 4300;

    // Listen
    const server = io.setup(app);
    server.listen(webPort, () => {
        LOGGER.info(`Web client listening at http://${ip.address()}:${webPort}.`);
    });

const get = () => app;

module.exports = { start, get };