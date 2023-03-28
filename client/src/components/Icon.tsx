import React from 'react';
import classNames from 'classnames';
import '@/styles/components/Icon.scss';

export interface IIconProps {
    id?: string,
    size?: number,
    font?: 'light' | 'regular' | 'solid',
    className?: string,
    children?: React.ReactNode
}

const Icon: React.FunctionComponent<IIconProps> = ({
    id,
    size = 20,
    font = 'light',
    className,
    children
}) => {
    const style = {
        '--Icon-size': size+'px'
    } as React.CSSProperties;

    // If children are passed, wrap them
    if(children) {
        return (
            <div 
                className={classNames('Icon', 'Icon--type-wrapper', className)} 
                style={style}>{children}</div>
        )
    }

    // If an id is passed, return the corresponding icon
    if(id) {
        return (
            <i 
                className={classNames(
                    'Icon', 'Icon--type-font-awesome',
                    'fa', `fa-${font}`, `fa-${id}`,
                    className
                )}
                style={style} />
        )
    }

    return null;
}

export default Icon;