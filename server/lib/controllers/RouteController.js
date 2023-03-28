const Controller = require('@/controllers/Controller');
const { globSync } = require('glob');
const path = require('path');
const _ = require('lodash');

class RouteController extends Controller {
    app;

    /**
     * Creates and stores an object of routes.
     */
    static _populate() {
        const matches = globSync('**/*.js', { cwd: ROUTES_DIR });

        const routes = _.mapValues(matches, match => {
            const route = require(path.join(ROUTES_DIR, match));
            
            if(typeof route == 'function')
                route.apply(null, [this.app]);

            return route;
        })

        return routes;
    }
}

module.exports = RouteController;