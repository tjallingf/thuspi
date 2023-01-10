import AdminInputField from '../components/Admin/AdminInputField';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Show from '../components/Show';
import LoadingIcon from '../components/Icon/LoadingIcon';

const AdminDevicesDevice = () => {
    const deviceId = useParams().id;
    const [ device, setDevice ] = useState(null);

    useEffect(() => {
        (async () => setDevice((await axios.get(`api/devices/${deviceId}`)).data))();
    }, []);

    return (
        <Show when={device} fallback={<LoadingIcon />}>
            <div className="AdminDevicesDevice container">
                <AdminInputField scope="devices" id="name" value={device?.name} />
            </div>
        </Show>
    )
}

export default AdminDevicesDevice;