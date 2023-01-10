const _ = require('lodash');
const { EventEmitter } = require('events');

class Model extends EventEmitter {
    id;
    props = {};
    isValid = true;
    controller

    constructor(id, props = {}, controller) {
        super();
        
        if(id == undefined)
            throw new Error('Cannot initialize Model without valid id.');

        this.id = id;
        this.props = props;
        this.controller = controller;

        return this;
    }

    getProps() {
        const props = this.props;
        props.id = this.id;
        return props;
    }

    setProps(newProps) {
        // Mutate `this.props` recursively
        this.props = _.merge(this.props, newProps);

        // Update the controller
        this.controller.handleUpdate(this.id);

        return this;
    }
    
    getProp(keypath) {
        return _.get(this.getProps(), keypath);
    }

    setProp(keypath, value) {
        const obj = {};
        _.set(obj, keypath, value);
        
        return this.setProps(obj);
    }

    toString() {
        const type = this.constructor.name.replace('Model', '') || this.constructor.name;
        const name = this.props.name || this.props.username || this.props.title;

        return `<${type} ${name}:${this.id}>`;
    }

    validate() {
        throw new Error("Method 'validate' is not implemented.");
    }
    
    exists() {
        return (this.props != undefined);
    }
}

module.exports = Model;