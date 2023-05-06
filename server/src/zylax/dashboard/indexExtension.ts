import DashboardWidget from './DashboardWidget';
import { Constructor } from '../types';
import registerModule from '../extensions/registerModule';

export function registerWidget(name: string, callback: () => Constructor<DashboardWidget>) {
    registerModule(name, callback);
}

export { default as DashboardWidget } from './DashboardWidget';
