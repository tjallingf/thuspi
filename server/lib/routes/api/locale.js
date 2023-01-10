const LocaleController = require('@controllers/LocaleController');

module.exports = app => {
    app.get('/api/locale/:id', (req, res, next) => {
        const json = LocaleController.find(req.params.id.toLowerCase());

        if (json == undefined)
            return next({ status: 404, message: `Cannot find locale '${req.params.id}'.` });

        return res.send(json);
    })
}