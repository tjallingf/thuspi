import * as _ from 'lodash';
import Model from '../lib/Model';

export type FilterPredicate<TModel> = (model: TModel) => boolean;
export type Data<TModel, TId extends string | number> = { [key in TId]: TModel };

export default function Controller<TModel extends Model, TId extends string | number = string>() {
    abstract class Controller {
        protected static data: Data<TModel, TId>;

        static index(): TModel[] {
            return Object.values(this.indexObject());
        }

        static indexBy(predicate: FilterPredicate<TModel>): TModel[] {
            return _.filter(this.index(), predicate);
        }

        static find(id: TId): TModel {
            return this.indexObject()[id];
        }

        static findBy(propKey: string, propValue: any): TModel;
        static findBy(predicate: FilterPredicate<TModel>): TModel;
        static findBy(...args: any[]) {
            if(typeof args[0] === 'function') {
                return _.find(this.index(), args[0]);
            }
            
            if(typeof args[0] === 'string') {
                return _.find(this.index(), o => {
                    console.log({ o, n: args[0], a: o.getProp(args[0]) })
                    return true;
                });
            }

            return null;
        }

        static update(id: TId, value: TModel) {}

        static exists(id: TId): boolean {
            return this.find(id) != undefined;
        }

        static store(data: Data<TModel, TId>): void {
            this.data = data;
        }
        
        static load(...args: any[]): void;
        static load(): void {
            throw new Error('Method load() is not implemented.');
        }

        protected static indexObject(): Data<TModel, TId> { 
            if(!this.data)
                throw new Error(`${this.name} must be loaded() before calling index().`);  

            return this.data;
        }
    }

    return Controller;
}