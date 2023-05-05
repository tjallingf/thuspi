import path from 'path';
import { ROOT_DIR } from '@/zylax/constants';
import restify from 'restify';

export default (server: restify.Server) => {
    server.get(
        '*',
        restify.plugins.serveStatic({
            directory: path.join(ROOT_DIR, './public'),
        }),
    );
};
