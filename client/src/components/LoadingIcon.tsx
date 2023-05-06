import React from 'react';
import classNames from 'classnames';
import Icon from './Icon';
import '@/styles/components/LoadingIcon.scss';

export interface ILoadingIconProps {
    size?: number,
    label?: React.ReactNode | string,
    className?: string,
    animated?: boolean
}

const LoadingIcon: React.FunctionComponent<ILoadingIconProps> = ({
    size = 16,
    label,
    className,
    animated
}) => {
    return (
        <Icon 
            className={classNames(
                'LoadingIcon', 
                {'LoadingIcon--animated': animated}, 
                className
            )}
            size={size}>
            <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M480 256C480 379.712 379.712 480 256 480C132.288 480 32 379.712 32 256C32 132.288 132.288 32 256 32C379.712 32 480 132.288 480 256Z" stroke="none" strokeWidth="64"/>
            </svg>
            {label && <div className="LoadingIcon__label">{label}</div>}
        </Icon>
    )
}

export default LoadingIcon;