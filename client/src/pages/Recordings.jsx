import { useState, useEffect } from 'react';
import { fetchGroupedDevices } from '../helpers/devices';
import Recording from '../components/Recordings/Recording';
import { isArray, isObject } from '../app/functions';
import Repeat from '../components/Repeat';
import DeviceGroupsRow from '../components/Devices/DeviceGroupsRow';
import LoadingIcon from '../components/Icon/LoadingIcon';

const Recordings = () => {
    const [ deviceTypes,    setDeviceTypes ]    = useState();
    const [ groups,         setGroups ]         = useState();
    const [ selectedGroup,  setSelectedGroup ]  = useState();
    const [ filteredGroups, setFilteredGroups ] = useState();

    useEffect(() => {
        // (async () => setGroups(await fetchGroupedDevices()))();
        // (async () => setDeviceTypes(await useFetch('extensions/any/device_types')))();
    }, []);

    useEffect(() => {
        if(!isArray(groups) || !isObject(deviceTypes)) return;

        // remove devices that don't support recording
        // remove empty groups
        setFilteredGroups(groups.map(group => {
            group.devices = group.devices.filter(device => {
                const [extensionId, module] = device?.type?.split('/');
                const manifest = deviceTypes[extensionId][module]?.manifest;

                return device?.options?.recording?.enabled === true && manifest?.reading?.supported === true
            });

            return group;
        }).filter(g => g.devices.length > 0));
    }, [groups, deviceTypes])

    const renderRecordings = (groups) => {
        if(!groups) return (
            <Repeat repeat={2}>
                <Recording asSkeleton="true" />
            </Repeat>
        );

        try {
            return (
                groups.filter(g => {
                    if(g.id == '__ALL__') return false;
                    if(selectedGroup) return (g.id == selectedGroup);
                    return true;
                }).map(group => (
                    group.devices.map(device => (
                        <Recording 
                            key={device.id} 
                            color={group.color} 
                            {...device} />
                    ))
                ))
            )
        } catch(err) {
            console.error(err);
        }
    }
    
    return (
        <LoadingIcon />
    )
}

export default Recordings;