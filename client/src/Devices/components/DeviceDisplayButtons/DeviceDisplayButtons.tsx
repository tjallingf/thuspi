import React, { MouseEvent, useRef } from 'react';
import { Box, Button, Icon, Tile, colorpalettes } from '@tjallingf/react-utils';

export interface IDeviceDisplayButtonsProps {
  onChange?(name: string, value: any): void;
  display: {
    buttons: IDeviceDisplayButton[];
  };
  deviceColor: string;
}

export interface IDeviceDisplayButton {
  icon: string;
  color?: string;
  isActive?: boolean;
  name: string;
}

const DeviceDisplayButtons: React.FunctionComponent<IDeviceDisplayButtonsProps> = ({
  onChange,
  display,
  deviceColor,
}) => {
  if (!display.buttons?.length) return null;

  const values = useRef<{ [key: string]: boolean }>(
    Object.fromEntries(display.buttons.map((button) => [button.name, !!button.isActive])),
  );

  const handleClick = (e: MouseEvent, name: string) => {
    values.current[name] = !values.current[name];
    onChange?.apply(null, [name, values.current[name]]);
  };

  const renderButtons = () => {
    return display.buttons.map((button) => {
      const { icon, color, isActive, name } = button;

      const colorpalette = colorpalettes[color] || colorpalettes[deviceColor];

      return (
        <Button
          key={name}
          variant="secondary"
          square
          size="sm"
          active={isActive}
          primary={colorpalette}
          onClick={(e: MouseEvent) => handleClick(e, name)}
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
