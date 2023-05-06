import React from 'react';
import classNames from 'classnames';

export interface IBoxProps {
    padding?: number,
    direction?: 'row' | 'column',
    justify?: 'start' | 'center' | 'end' | 'stretch',
    align?:   'start' | 'center' | 'end' | 'stretch',
    gutterX?: 0 | 1 | 2 | 3 | 4 | 5,
    gutterY?: 0 | 1 | 2 | 3 | 4 | 5,
    className?: string,
    children?: React.ReactNode,
    wrap?: 'nowrap' | 'wrap',
    [key: string]: any
}

const Box: React.FunctionComponent<IBoxProps> = ({
    direction = 'row', 
    align = 'start', 
    justify = 'start',
    gutterX = 0,
    gutterY = 0,
    className,
    children,
    wrap = 'nowrap',
    ...rest
}) => (
    <div {...rest}
        className={classNames(
            'Box',
            'd-flex', 
            `flex-${direction}`, 
            `flex-${wrap}`,
            `align-items-${align}`,
            `justify-content-${justify}`,
            `gx-${gutterX}`,
            `gy-${gutterY}`,
            className
        )}>
        {children}
    </div>
)

export default Box;