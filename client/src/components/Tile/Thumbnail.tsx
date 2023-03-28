import { ReactNode, FunctionComponent } from 'react';
import classNames from 'classnames';

export interface ITileThumbnailProps {
    className?: string,
    children?: ReactNode
}

const TileThumbnail: FunctionComponent<ITileThumbnailProps> = ({
    className,
    children,
    ...rest
}) => (
    <div className={classNames('Tile__thumbnail', className)} {...rest}>{children}</div>
)

export default TileThumbnail;