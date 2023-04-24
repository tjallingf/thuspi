import Model from '../lib/Model';

export type ExtensionModuleTag = string;

class ExtensionModule extends Model {
    constructor(...args: any[]) {
        super(null, {
            enableLogger: true
        });
    }
}

export default ExtensionModule;