import { useState, useEffect } from 'react';
import LoadingIcon from '../components/Icon/LoadingIcon';
import useUser from '../hooks/useUser';
import Show from '../components/Show';
import axios from 'axios';
import { withGroups } from '../app/helpers/devices';
import { map } from 'lodash';
import Tile from '../components/Tile/Tile';
import Button from '../components/Button';

const AdminDevices = () => {
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

    return (
        <Show when={devices} fallback={<LoadingIcon />}>
            <div className="AdminDevices container">
                {map(devices, (device, id) => (
                    <Button type="tile" to={`/admin/devices/${id}/`}>
                        <Tile title={device.name} iconName={device.icon} iconColor={device.group.color}>
                            <span className="text-muted">{id}</span>
                        </Tile>
                    </Button>
                ))}
            </div>
        </Show>
    )
}

export default AdminDevices;