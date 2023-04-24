import DashboardWidget from './DashboardWidget';
import { Constructor } from '../types';
import registerModule from '../extensions/registerModule';

export function registerWidget(tag: string, callback: () => Constructor<DashboardWidget>) {
    registerModule(tag, callback);
}

export { default as DashboardWidget } from './DashboardWidget';
