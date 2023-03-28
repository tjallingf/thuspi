const ExtensionController = require('@/controllers/ExtensionController');
const path = require('path');
const _ = require('lodash');

module.exports = app => {
    app.get('/api/extensions', async (req, res, next) => {
        const extensions = ExtensionController.index();

        return res.json(extensions);
    })

    app.get('/api/extensions/:id/modules/*', async (req, res, next) => {
        const extension = ExtensionController.find(req.params.id);
        if(!extension) 
            return next({ status: 404, message: `Cannot find extension with id '${req.params.id}'.`});
        
        const itemName = req.params['0'];
        if(!itemName) 
            return next({ status: 400, message: 'An item name was not specified.' });

        if(!extension.itemNameToFilepath(itemName))
            return next({ status: 400, message: `Item '${itemName}' is not a file.`});

        let data = {};
        try {
            const item = extension.getModule(itemName);
            data = {
                name: item.name,
                contents: extension.readContents(itemName, { allowScripts: true })
            };
        } catch(err) {
            return next(err);
        }

        return res.json(data);
    })
}