import { Icon, Tile, Box } from '@tjallingf/react-utils';
import type { DeviceStateDisplay } from '@server/devices/DeviceState';
import './DeviceDisplayTile.scss';

export interface IDeviceDisplayTileProps {
    onChange?(name: string, value: any): void;
    display: DeviceStateDisplay;
    deviceColor: string;
}

const DeviceDisplayTile: React.FunctionComponent<IDeviceDisplayTileProps> = ({ display }) => {
    const thumbnail = (() => {
        if (display.tile.thumbnailSrc) return <img src={display.tile.thumbnailSrc} />;

        if (display.tile.icon) return <Icon id={display.tile.icon} />;
    })();

    console.log({ display });

    return (
        <Tile className="DeviceDisplayTile">
            <Box direction="row" gutterX={2}>
                <div className="DeviceDisplayTile__thumbnail">{thumbnail}</div>
                <div className="DeviceDisplayTile__content">
                    {display.tile.title && <Tile.Title>{display.tile.title}</Tile.Title>}
                    {display.tile.description}
                </div>
            </Box>
        </Tile>
    );
};

export default DeviceDisplayTile;
