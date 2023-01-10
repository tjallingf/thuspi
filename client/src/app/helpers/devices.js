import { each, mapValues, omit } from 'lodash';
import useTranslate from '../../hooks/useTranslate';

const withGroups = (devices, groups) => {
    let groupIndexes = {};
    each(groups, (group, groupId) => each(group.devices, deviceId => 
        groupIndexes[deviceId] = groupId
    ));

    const res = mapValues(devices, (device, deviceId) => {
        device.group = groupIndexes[deviceId] == undefined 
            ? null
            : omit(groups[groupIndexes[deviceId]], 'devices');

        return device;
    });

    return res;
}

export { withGroups };