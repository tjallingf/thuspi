import { FunctionComponent } from 'react';
import Page from '@/components/Page';
import Container from '@/components/Container';
import { useState } from 'react';
import Masonry from '@/components/Masonry';
import { useQuery } from '@tanstack/react-query';
import Device from '@/pages/Devices/Device';
import useSocketEvent from '@/hooks/useSocketEvent';
import { replaceById } from '@/utils/array';

interface IDeviceProps {
    id: number
}


interface IRoomProps {
    id: number,
    devices: number[]
}

const Devices: FunctionComponent = () => {
    const [ activeRoom, setActiveRoom ] = useState(0);
    let { data: devices } = useQuery<IDeviceProps[]>(['devices']);
    let { data: rooms } = useQuery<IRoomProps[]>(['rooms']);

    // useSocketEvent('devices:change', ({ device }) => {
    //     setDevices( => replaceById(cur, device.id, device));
    // })

    const renderDevices = () => {
        // if(typeof rooms == 'undefined' || !activeRoom) return null;

        // const filteredDevices = devices!.filter(props => 
        //     rooms[3].devices.includes(props.id));

        return (
            <Masonry
                breakpointCols={{ default: 6, 1200: 5, 992: 3, 768: 3, 576: 2 }}
                className="flex-row align-items-start">
                {devices?.map((props: any) => (
                    <Device {...props}
                        key={props.id} />
                ))}
            </Masonry>
        );
    }

    return (
        <Page id="devices">
            <Container>
                {renderDevices()}
            </Container>
        </Page>
    )
}

export default Devices;