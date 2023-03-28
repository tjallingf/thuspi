const ExtensionController = require('@/controllers/ExtensionController');
const _ = require('lodash');

module.exports = app => {
    app.get('/api/languages/:lang', (req, res, next) => {
        // The language to find (i.e. 'en-us')
        const lang = req.params.lang.toLowerCase();
        
        const json = ExtensionController.mapAssets(['language', lang], (asset, ext) => {
            const messages = asset.getContents();

            // Prepend the extension id to each message id
            return _.mapKeys(messages, (v, k) => ext.id+'.'+k);
        });

        if (json == undefined)
            return next({ status: 404, message: `Language '${lang}' not found.` });

        return res.send(json);
    })
}