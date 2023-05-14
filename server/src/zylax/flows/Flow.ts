import ModelWithProps, { ModelWithPropsConfig } from '../lib/ModelWithProps';
import _ from 'lodash';
import FlowController from './FlowController';
import { FlowProps } from '~shared/types/flows/Flow';

export default class Flow extends ModelWithProps<FlowProps> {
    _getConfig(): ModelWithPropsConfig<FlowProps, FlowProps> {
        return {
            controller: FlowController,
            defaults: {
                name: '',
                icon: '',
                program: {
                    blocks: {}
                }
            }
        }
    }
}
