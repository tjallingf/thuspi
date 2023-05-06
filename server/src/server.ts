import ip from 'ip';
import express, { Express } from 'express';
require('express-async-errors');
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import ExpressMySQLSession from 'express-mysql-session';
import passportService from './server/services/passport';
// import errorMiddleware from './middleware/apiErrorMiddleware';
import defaultUserMiddleware from './server/middleware/defaultUserMiddleware';
// import apiMiddleware from './middleware/apiMiddleware';
import { WebSocket, Database, Config, logger } from './zylax';
import * as routeCollections from './routes';

const MySQLStore = ExpressMySQLSession(session);

export function start() {
    const server = express();

    // Parse cookies
    server.use(cookieParser());

    // Compress requests
    server.use(compression());

    // Setup static directory
    server.use(express.static('public'));

    // Parse JSON bodies
    server.use(express.json());

    // Allow CORS
    server.use(cors());

    // Setup Passport.js middleware
    server.use(
        session({
            secret: passportService.getOrCreateSecret(),
            resave: false,
            saveUninitialized: false,
            store: new MySQLStore({}, Database.connection),
        }),
    );
    server.use(passport.authenticate('session'));

    // Disable 'X-Powered-By' header
    server.disable('x-powered-by');

    server.use(defaultUserMiddleware);

    // // Setup API middleware
    // server.use(apiMiddleware);

    // Initialize Passport.js
    passportService.initialize();

    // Load routes
    Object.values(routeCollections).forEach((routeCollection: (...args: any[]) => any) => {
        routeCollection(server);
    });

    // // Setup error handler middelware
    // server.use(errorMiddleware);
    // Get web port
    const serverPort = Config.get('system.server.port');

    const serverWithWebsocket = WebSocket.setup(server);

    serverWithWebsocket.listen(serverPort, () => {
        logger.info(`Web client listening at http://${ip.address()}:${serverPort}.`);
    });
}
