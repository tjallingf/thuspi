import Model, { ModelConfig } from '../lib/Model';
import { logger } from './Logger';
import { PromiseAllObject } from '../utils/Promise';
import * as _ from 'lodash';
import Controller from './Controller';

interface ModelWithPropsConfig<TProps extends Object = Object> extends ModelConfig {
    dynamicProps?: string[];
    hiddenProps?: string[];
    controller: any;
    propsDefaults?: TProps;
}

abstract class ModelWithProps<
    TProps extends Object = Object, 
    TSerializedProps extends Object = TProps,
    TId extends string | number = number
> extends Model<TId> {
    static cnf: ModelWithPropsConfig;
    cnf(): ModelWithPropsConfig {
        // @ts-ignore
        return this.constructor.cnf;
    }

    protected props: TProps = {} as TProps;

    constructor(id: TId, props: TProps) {
        super(id);

        this.props = _.defaultsDeep(props, this.cnf().propsDefaults);

        this.init();
    }

    protected init() {}

    /**
     * Get all properties of the model.
     * @returns A copy of the properties of the model.
     */
    getProps(includeHidden = true): Partial<TProps> {
        let propsClone: Partial<TProps> = Object.assign({}, this.props);

        if (!includeHidden && this.cnf().hiddenProps?.length) {
            propsClone = _.omit(propsClone, this.cnf().hiddenProps);
        }

        return propsClone;
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

    addSyncDynamicProps(props: Partial<TProps>): Partial<TProps> {
        if (this.cnf().dynamicProps?.length) {
            this.cnf().dynamicProps.forEach(async (key) => {
                const getValueFunc = this[`prop_${key}`];
                if (typeof getValueFunc !== 'function') {
                    logger.warn(`Method 'prop_${key}()' does not exist on model ${this.constructor.name}.`);
                    return true;
                }

                props[key] = getValueFunc.apply(this);
            });
        }

        props.id = this.getId();

        return props;
    }

    async addAllDynamicProps(props: Partial<TProps>): Promise<Partial<TProps>> {
        const syncDynamicProps = this.addSyncDynamicProps(props);
        return await PromiseAllObject(syncDynamicProps);
    }


    toJSON() {
        return this.addSyncDynamicProps(this.getProps(false));
    }

    async serialize() {
        return await this.addAllDynamicProps(this.getProps(false)) as unknown as TSerializedProps;
    }
}

export default ModelWithProps;
