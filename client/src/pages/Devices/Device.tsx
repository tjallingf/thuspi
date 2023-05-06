import useAuth from '@/hooks/useAuth';
import React, { useState } from 'react';
import Tile from '@/components/Tile';
import Icon from '@/components/Icon';
import Box from '@/components/Box';
import Button from '@/components/Button';
import classNames from 'classnames';
import { textDark } from '@/utils/theme/colors';
import colorpalettes from '@/utils/theme/colorpalettes';
import '@/styles/pages/Devices/Device.scss';
import DeviceDisplayWidget from './DeviceDisplayWidget';
import DeviceDisplayButtons from './DeviceDisplayButtons';
import queryClient from '@/utils/queryClient';
import useSocketEvent from '@/hooks/useSocketEvent';

export interface IDeviceProps {
    id: number,
    name: string,
    icon: string,
    color: string,
    state: any
}

const Device: React.FunctionComponent<IDeviceProps> = (props) => {
    const [ updatedProps, setUpdatedProps ] = useState<IDeviceProps>(props);
    const { id, state, color, name, icon }  = updatedProps;
    const isActive = state?.isActive;

    useSocketEvent('devices:change', e => {
        setUpdatedProps(e.device);
    })

    const handleInput = (name: string, value: boolean | string | number) => (
        queryClient.fetchQuery([`devices/${id}/inputs`, {
            method: 'patch',
            data: {
                inputs: [
                    {
                        name: name,
                        value: value
                    }
                ]
            }
        }])
    )

    const renderContent = () => {
        if(!state?.display?.type) return null;

        switch(state.display.type) {
            case 'widget':
                return <DeviceDisplayWidget {...state.display} />;
            case 'buttons':
                return <DeviceDisplayButtons {...state.display} onChange={handleInput} />;
            default:
                console.error(`Invalid display type: '${state.display.type}'.`);
                return null;
        }

    }

    return (
        <Tile 
            className={classNames(
                'Device',
                { 'Device--active': isActive }
            )}
            style={{
                '--Device--active-background-start': colorpalettes[color][2],
                '--Device--active-background-stop': colorpalettes[color][3],
                '--Device--active-color': textDark
            } as React.CSSProperties}>
            <Tile.Title>
                <Button to={`/devices/${id}`} variant="minimal" size="md">
                    <Box gutterX={2} align="center" className="w-100">
                        <Icon id={icon} size={20} font={isActive ? 'solid' : 'light'} />
                        <div className="text-truncate">{name}</div>
                        <Icon id="chevron-right" size={12} font="solid" className="ms-auto" />
                    </Box>
                </Button>
            </Tile.Title>
            <Tile.Content>
                <Box gutterX={1} gutterY={1} wrap="wrap" className="Device__display">
                    {renderContent()}
                </Box>
            </Tile.Content>
        </Tile>
    )
}

export default Device;