const Controller = require('@controllers/Controller');
const glob = require('glob');
const path = require('path');
const _ = require('lodash');

class RouteController extends Controller {
    app;

    /**
     * Creates and stores an object of routes.
     */
    static populate() {
        const matches = glob.sync('**/*.js', { cwd: DIRS.ROUTES });

        const routes = _.mapValues(matches, match => {
            const route = require(path.join(DIRS.ROUTES, match));
            
            if(typeof route == 'function')
                route.apply(null, [this.app]);

            return route;
        })

        return routes;
    }
}

module.exports = RouteController;