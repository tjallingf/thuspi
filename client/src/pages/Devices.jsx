import { useState, useEffect } from 'react';
import Device from '../components/Devices/Device';
import LoadingIcon from '../components/Icon/LoadingIcon';
import DeviceGroupsRow from '../components/Devices/DeviceGroupsRow';
import Icon from '../components/Icon/Icon';
import useUser from '../hooks/useUser';
import Show from '../components/Show';
import axios from 'axios';
import { withGroups } from '../app/helpers/devices';
import { map } from 'lodash';

const Devices = () => {
    const [ devices, setDevices ] = useState(null);
    const user = useUser();

    useEffect(() => {
        (async () => setDevices(
            withGroups(
                (await axios.get('api/devices')).data, 
                user.getSetting('deviceGroups') || {}
            )
        ))();
    }, []);

    const handleGroupChange = e => {
        console.log({e});
    }

    const renderContent = () => {
        console.log({devices});

        switch(user.getSetting('displayDeviceGroupsAs')) {
            // case 'list':
            //     return map(user.getSetting('deviceGroups'), (group, id) => (
            //         <div className="mb-2" style={{marginLeft: '-1.75rem'}}>
            //             <div className="flex-row mb-2">
            //                 <Icon name={group.icon} color={group.color} size="sm" />
            //                 <h1>{group.name}</h1>
            //             </div>
            //             <div className="flex-row" style={{marginLeft: '1.75rem'}}>
            //                 {group.devices.map(id => {
            //                     console.log(devices);
            //                     const device = devices[id];
            //                     if(!device) return;

            //                     return <Device id={id} {...device} key={id} />
            //                 })}
            //             </div>
            //         </div>
            //     ))
            default:
                return (<>
                    <DeviceGroupsRow groups={user.getSetting('deviceGroups')} onChange={handleGroupChange} />
                    <div className="row">
                        {map(devices, (device, id) => (
                            <Device {...device}
                                key={id} 
                                id={id} />
                        ))}
                    </div>
                </>)
        }
    }

    return (
        <Show when={devices} fallback={<LoadingIcon />}>
            <div className="Devices container">
                {devices && renderContent()}
            </div>
        </Show>
    );
}

export default Devices;