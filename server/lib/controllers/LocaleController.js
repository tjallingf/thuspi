const Controller = require('@controllers/Controller');
const ExtensionController = require('@controllers/ExtensionController');
const _ = require('lodash');

class LocaleController extends Controller {
    /**
     * Creates and stores an object of locales.
     */
    static populate() {
        let translations = {};

        ExtensionController.mapAllWithItem('locale', (extension, itemName) => {
            const { items } = extension.getItem(itemName);
            if(!items) return;

            _.map(items, (locale, localeName) => {
                translations[localeName] = translations[localeName] || {};
                translations[localeName][extension.id] = extension.readItem(`${itemName}/${localeName}`);
            })
        })

        return translations;
    }
}

module.exports = LocaleController;