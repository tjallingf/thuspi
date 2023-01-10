const ConfigController = require('@controllers/ConfigController');

module.exports = app => {
    app.get('/api/config', (req, res, next) => {
        return res.json(ConfigController.safeIndex());
    })

    app.get('/api/config/:keypath', (req, res, next) => {
        const config = req.params['keypath'].split('.')[0];
        const data = ConfigController.safeFind(config);

        if(!data) return next({ status: 404, message: `Config '${config}' does not exist, or is secret.` });
        
        return res.json(data);
    })
}