import ip from 'ip';
import express, { Express } from 'express';
require('express-async-errors');
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import ExpressMySQLSession from 'express-mysql-session';
import passportWrapper from './passportWrapper';
import errorMiddleware from './middleware/apiErrorMiddleware';
import defaultUserMiddleware from './middleware/defaultUserMiddleware';
import apiMiddleware from './middleware/apiMiddleware';
import { WebSocket, Database, Config, logger } from '../../zylax';
import * as routeCollections from '../../server/routes/index';

const MySQLStore = ExpressMySQLSession(session);

export default class ExpressApp {
    static app: Express;

    static setup() {
        this.app = express();

        // Parse cookies
        this.app.use(cookieParser());

        // Compress requests
        this.app.use(compression());

        // Setup static directory
        this.app.use(express.static('public'));

        // Parse JSON bodies
        this.app.use(express.json());

        // Allow CORS
        this.app.use(cors());

        // Setup Passport.js middleware
        this.app.use(
            session({
                secret: passportWrapper.secret(),
                resave: false,
                saveUninitialized: false,
                store: new MySQLStore({}, Database.connection),
            }),
        );
        this.app.use(passport.authenticate('session'));

        // Disable 'X-Powered-By' header
        this.app.disable('x-powered-by');

        // Setup middleware to fallback to the default
        // user when the user is not signed in
        this.app.use(defaultUserMiddleware);

        // Setup API middleware
        this.app.use(apiMiddleware);

        // Initialize Passport.js
        passportWrapper.init();

        // Load routes
        Object.values(routeCollections).forEach((routeCollection: (...args: any[]) => any) => {
            routeCollection(this.app);
        });

        // Setup error handler middelware
        this.app.use(errorMiddleware);
    }

    static listen() {
        // Get web port
        const webPort = Config.get('system.webClient.port') || 4300;

        // Listen
        const server = WebSocket.setup(this.app);
        server.listen(webPort, () => {
            logger.info(`Web client listening at http://${ip.address()}:${webPort}.`);
        });
    }
}
