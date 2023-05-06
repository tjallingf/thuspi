import Model, { ModelConfig } from '../lib/Model';
import { logger } from './Logger';
import { PromiseAllObject } from '../utils/Promise';
import * as _ from 'lodash';
import Controller from './Controller';

interface ModelWithPropsConfig<TProps extends Object = Object> extends ModelConfig {
    dynamicProps?: string[];
    hiddenProps?: string[];
    controller: any;
    propsDefaults: TProps;
}

abstract class ModelWithProps<TProps extends Object = Object> extends Model {
    static cnf: ModelWithPropsConfig;
    cnf(): ModelWithPropsConfig {
        // @ts-ignore
        return this.constructor.cnf;
    }

    protected props: TProps = {} as TProps;

    constructor(id: string, props: TProps) {
        super(id);

        this.props = _.defaultsDeep(props, this.cnf().propsDefaults);

        this.init();
    }

    protected init() {}

    /**
     * Get all properties of the model.
     * @returns A copy of the properties of the model.
     */
    getProps(includeHidden = true): TProps {
        let props = this.props;

        if (!includeHidden && this.cnf().hiddenProps?.length) {
            props = _.omit(props, this.cnf().hiddenProps);
        }

        return Object.assign({}, props);
    }

    /**
     * Override the existing properties with the new properties.
     * @param newProps The new properties.
     */
    setProps(newProps: TProps) {
        // Update properties recursively
        this.props = _.defaultsDeep(newProps, this.props);

        // Update the controller
        const controller = this.cnf().controller;
        if (this.id && typeof controller.update === 'function') {
            controller.update(this.id, this);
        }

        return this;
    }

    /**
     * Get a specific property by keypath.
     * @param keypath The keypath of the property to get.
     */
    getProp<TKey extends keyof TProps>(keypath: TKey): TProps[TKey];
    getProp(keypath: string): any;
    getProp(keypath: string) {
        return _.get(this.getProps(), keypath);
    }

    /**
     * Set a specific property by keypath.
     * @param keypath The keypath of the property to set.
     * @param value The value to set the property to.
     */
    setProp<TKey extends keyof TProps>(keypath: TKey, value: any): this;
    setProp(keypath: string, value: any): this;
    setProp(keypath: string, value: any) {
        this.setProps(_.set({} as TProps, keypath, value));

        return this;
    }

    async addDynamicProps(props: TProps): Promise<Object> {
        if (this.cnf().dynamicProps?.length) {
            const promises = {};

            this.cnf().dynamicProps.forEach(async (key) => {
                const getValueFunc = this[`prop_${key}`];
                if (typeof getValueFunc !== 'function') {
                    logger.warn(`Method 'prop_${key}()' does not exist on model ${this.constructor.name}.`);
                    return true;
                }

                let value = getValueFunc.apply(this);
                if (value instanceof Promise) {
                    promises[key] = value;
                } else {
                    props[key] = value;
                }
            });

            const dynamicProps = await PromiseAllObject(promises);
            Object.assign(props, dynamicProps);
        }

        return props;
    }
}

export default ModelWithProps;
