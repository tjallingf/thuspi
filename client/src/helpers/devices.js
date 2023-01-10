import useTranslate from '../hooks/useTranslate';
import { isArray } from './functions';

const fetchGroupedDevices = async () => {
    // return Promise.all([
    //     useFetch('devices'),
    //     useFetch('users/me', {query: {include: 'groups'}})
    // ]).then(([devices, {groups}]) => {
    //     if(!isArray(devices) || !isArray(groups)) return [];

    //     // find devices that are not in any group
    //     const ungroupedDevices = devices.filter(d => !groups.find(g => g.devices?.includes(d?.id)));
        
    //     groups = groups.map(group => {
    //         if(!isArray(group.devices)) group.devices = [];

    //         // replace entries of `group.devices` with device objects
    //         return {
    //             ...group,
    //             devices: group.devices.map(id => devices.find(d => d.id === id))
    //         };
    //     })

    //     // prepend group containing all devices
    //     groups.unshift({
    //         id: '__ALL__',
    //         name: useTranslate('generic.groups.all.name'),
    //         icon: 'fal.plug',
    //         color: 'accent',
    //         devices: devices
    //     });

    //     // append group containing ungrouped devices
    //     groups.push({
    //         id: '__UNGROUPED__',
    //         name: useTranslate('generic.groups.ungrouped.name'),
    //         icon: 'fal.ellipsis',
    //         color: 'orange',
    //         devices: ungroupedDevices
    //     })

    //     // filter groups with zero devices
    //     groups = groups.filter(g => g.devices?.length > 0);

    //     return groups;
    // });
}

export { fetchGroupedDevices };