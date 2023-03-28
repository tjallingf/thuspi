import React from 'react';
import Tile from '@/components/Tile';
import Icon from '@/components/Icon';
import '@/styles/pages/Devices/DeviceDisplayWidget.scss'

export interface IDeviceDisplayWidgetProps {
    title?: string,
    content?: string,
    imageSrc?: string,
    icon?: string
}

const DeviceDisplayWidget: React.FunctionComponent<IDeviceDisplayWidgetProps> = ({
    title, content, imageSrc, icon
}) => {
    const thumbnail = (() => {
        if(imageSrc) 
            return <img src={imageSrc} />;

        if(icon) 
            return <Icon id={icon} />;
    })();

    return (
        <Tile className="DeviceDisplayWidget">
            {title && <Tile.Title>{title}</Tile.Title>}
            {content && <Tile.Content className="text-truncate">{content}</Tile.Content>}
            {thumbnail && <Tile.Thumbnail>{thumbnail}</Tile.Thumbnail>}
        </Tile>
    )
}

export default DeviceDisplayWidget;