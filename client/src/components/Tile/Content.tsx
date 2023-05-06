import { ReactNode, FunctionComponent } from 'react';
import classNames from 'classnames';

export interface ITileContentProps {
    children?: ReactNode,
    className?: string,
    [key: string]: any
}

const TileContent: FunctionComponent<ITileContentProps> = ({
    children,
    className,
    ...rest
}) => (
    <div className={classNames('Tile__content', className)} {...rest}>{children}</div>
)

export default TileContent;