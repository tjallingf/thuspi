const Model = require('@/models/Model');

class ExtensionModuleInstance extends Model {
    #instance;
    
    constructor(blueprint, args = []) {
        super();
        this.#instance = new blueprint(...args);
    }
    
    /**
     * Invokes a method of the instance.
     * @param {string} method - The name of the method to invoke.
     * @param {array} args - The arguments that should be passed.
     * @returns {any} - The result.
     */
    async invoke(method, args = []) {
        if(typeof this.#instance[method] != 'function') 
            throw new Error(`Method '${method}()' does not exist on ${this.#instance}.`);
        
        let result = this.#instance[method]?.apply(this.#instance, args);
        if(result instanceof Promise) 
            result = await result;

        return result;
    }

    /**
     * Checks whether the instance has a method.
     * @param {string} method - The name of the method.
     * @returns {boolean} Whether the instance has the method.
     */
    async hasMethod(method) {
        return (typeof this.#instance[method] === 'function');
    }
}

module.exports = ExtensionModuleInstance;