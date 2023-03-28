import React from 'react';
import classNames from 'classnames';

export interface IContainerProps {
    fluid?: boolean,
    children?: React.ReactNode,
    className?: string
}

const Container: React.FunctionComponent<IContainerProps> = ({
    fluid = false,
    className,
    children
}) => {
    return (
        <div className={classNames(
            'container',
            { 'container-fluid': fluid },
            className,
        )}>
            {children}
        </div>
    )
}

export default Container;