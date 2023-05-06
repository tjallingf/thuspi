import React, { MouseEvent, useRef } from 'react';
import { Box, Button, Icon, Tile, colorpalettes } from '@tjallingf/react-utils';
import type { DeviceStateDisplay } from '@server/devices/DeviceState';

export interface IDeviceDisplayButtonsProps {
    onChange?(name: string, value: any): void;
    display: DeviceStateDisplay;
    deviceColor: string;
}

const DeviceDisplayButtons: React.FunctionComponent<IDeviceDisplayButtonsProps> = ({
    onChange,
    display,
    deviceColor,
}) => {
    if (!display.buttons?.length) return null;

    const values = useRef<{ [key: string]: boolean }>(
        Object.fromEntries(display.buttons.map((button) => [button.input, !!button.isActive])),
    );

    const handleClick = (e: MouseEvent, input: string) => {
        values.current[input] = !values.current[input];
        onChange?.apply(null, [input, values.current[input]]);
    };

    const renderButtons = () => {
        return display.buttons.map((button) => {
            const { icon, color, isActive, input } = button;

            const colorpalette = colorpalettes[color] || colorpalettes[deviceColor];

            return (
                <Button
                    key={input}
                    variant="secondary"
                    square
                    size="sm"
                    active={isActive}
                    primary={colorpalette}
                    onClick={(e: MouseEvent) => handleClick(e, input)}
                >
                    {icon && <Icon id={icon} size={18} font={isActive ? 'solid' : 'light'} />}
                </Button>
            );
        });
    };

    return (
        <Tile className="DeviceDisplayButtons p-1">
            <Box gutterX={2} gutterY={2} wrap="wrap">
                {renderButtons()}
            </Box>
        </Tile>
    );
};

export default DeviceDisplayButtons;
