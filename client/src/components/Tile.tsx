import { ReactNode, FunctionComponent } from 'react';
import classNames from 'classnames';
import '@/styles/components/Tile.scss';
import { IColor } from '@/utils/theme/colors';
import TileTitle from './Tile/Title';
import TileContent from './Tile/Content';
import TileThumbnail from './Tile/Thumbnail';

export interface ITileProps {
    children?: ReactNode,
    className?: string,
    background?: IColor,
    color?: IColor,
    size?: 'sm' | 'md' | 'lg',
    style?: React.CSSProperties
}

const TileComponent: FunctionComponent<ITileProps> = ({ 
    children, 
    className, 
    background, 
    color, 
    size = 'md', 
    style, 
    ...rest
}) => {
    return (
        <div {...rest} 
            className={classNames('Tile', `Tile--size-${size}`, className)} 
            style={{ 
                background: background?.toString(),
                color: color?.toString(),
                ...style
            }}>{children}</div>
    )
}

const Tile = Object.assign(TileComponent, {
    Title: TileTitle,
    Thumbnail: TileThumbnail,
    Content: TileContent
})

export default Tile;