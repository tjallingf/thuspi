import React, { MouseEvent, useRef } from 'react';
import ToggleInput from '@/components/Inputs/ToggleInput';
import Button from '@/components/Button';
import Box from '@/components/Box';
import Icon from '@/components/Icon';
import Tile from '@/components/Tile';
import colorpalettes, { neutral } from '@/utils/theme/colorpalettes';
import { textDark } from '@/utils/theme/colors';

export interface IDeviceDisplayButtonsProps {
    onChange?(name: string, value: any): void,
    [key: string]: any
}

const DeviceDisplayButtons: React.FunctionComponent<IDeviceDisplayButtonsProps> = ({ onChange, items }) => {
    const values = useRef<{[key: string]: any}>({});
    
    const handleClick = (e: MouseEvent, name: string) => {
        values.current[name] = !values.current[name];
        onChange?.apply(null, [ name, values.current[name] ]);
    }
    
    const renderItems = () => {
        return items.map((item: any) => {
            let { icon, color, isActive, name } = item;

            color = colorpalettes[color] ? color : 'blue';

            return (
                <Button
                    variant="secondary" 
                    size="sm" 
                    shape="square" 
                    active={isActive}
                    primary={color ? colorpalettes[color] : undefined}
                    onClick={(e: MouseEvent) => handleClick(e, name)}>
                        {icon && <Icon id={icon} size={18} font={isActive ? 'solid' : 'light'} />}
                    </Button>
            );
        })
    }

    return (
        <Tile>
            <Tile.Content>
                <Box gutterX={2} gutterY={2}>
                    {renderItems()}
                </Box>
            </Tile.Content>
        </Tile>
    );
}

export default DeviceDisplayButtons;