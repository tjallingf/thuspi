import { ReactNode, FunctionComponent } from 'react';
import classNames from 'classnames';

export interface ITileTitleProps {
    children?: ReactNode,
    className?: string
}

const TileTitle: FunctionComponent<ITileTitleProps> = ({
    children,
    className,
    ...rest
}) => (
    <h3 className={classNames('Tile__title', className)} {...rest}>{children}</h3>
)

export default TileTitle;