import restify from 'restify';
import * as routeCollections from './routes/index';
import { logger } from './zylax';
import { Config } from './zylax';

export function start() {
    const server = restify.createServer();

    Object.values(routeCollections).forEach((routeCollection) => {
        routeCollection(server);
    });

    const serverPort = Config.get('system.server.port');
    server.listen(serverPort, () => {
        logger.info(`Server listening at ${server.url}`);
    });
}
