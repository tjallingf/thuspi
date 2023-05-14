import ModelWithProps from '../lib/ModelWithProps';
import _ from 'lodash';
import FlowController from './FlowController';
import { FlowProps } from '~shared/types/flows/Flow';


export default class Flow extends ModelWithProps<FlowProps> {
    static cnf = {
        controller: FlowController,
    }
}
