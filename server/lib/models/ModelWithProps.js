const Model = require('@/models/Model');
const { PromiseAllObject } = require('@/utils');
const _ = require('lodash');

class ModelWithProps extends Model {
    props = {};

    constructor(id, props, controller, options) {
        super(id, controller, options);
        
        this.props = props;
    }

    /**
     * Gets all properties of the model.
     * @returns {object} A copy of the properties of the model.
     */
    getProps() {
        return _.omit(this.props);
    }

    /**
     * Overrides the existing properties with the new properties.
     * @param {object} newProps The new properties.
     * @returns {this}
     */
    setProps(newProps) {
        // Update properties recursively
        this.props = _.defaultsDeep(newProps, this.props);

        return this;
    }
    
    /**
     * Gets a specific property by keypath. 
     * @param {string} keypath The keypath of the property to get.
     * @returns {string|object|number|boolean} The value of the property.
     */
    getProp(keypath) {
        return _.get(this.getProps(), keypath);
    }

    /**
     * Sets a specific property by keypath.
     * @param {set} keypath The keypath of the property to set.
     * @param {string|object|number|boolean} value The value to set the property to.
     * @returns {this}
     */
    setProp(keypath, value) {
        const newProps = {};
        _.set(newProps, keypath, value);
        this.setProps(newProps);
        
        return this;
    }

    async getPropsWithAsync() {
        return new Promise((resolve, reject) => {
            if(!this.options.asyncProps?.length)
                return resolve(this.getProps());

            const promises = {};
            this.options.asyncProps.forEach(key => {
                const getValue = this[`_${key}Prop`];
                if(typeof getValue !== 'function') return true;

                promises[key] = getValue.apply(this);
            });

            PromiseAllObject(promises).then(asyncProps => {
                return resolve(_.omit({ ...this.getProps(), ...asyncProps }, this.options.hiddenProps));
            })        
        })
    }
}

module.exports = ModelWithProps;