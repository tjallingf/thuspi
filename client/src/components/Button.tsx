import React from 'react';
import classNames from 'classnames';
import { blue, neutral, IColorPalette } from '@/utils/theme/colorpalettes';
import { IColor, textLight, textDark, textPrimary, textPrimaryInverse, transparent } from '@/utils/theme/colors';
import '@/styles/components/Button.scss';
import LoadingIcon from './LoadingIcon';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const getContrastingColor = (value: number, palette: IColorPalette) => {
    const threshold = (palette.length / 2);

    if(palette[value].name == 'neutral') 
        return value <= threshold ? textPrimary : textPrimaryInverse;

    return value <= (palette.length / 2) ? textDark : textLight;
}

const getAccents = (primary: IColorPalette, secondary: IColorPalette, variant: string): any => {
    const accents: any = {
        primary: {
            default: [ primary[5], 'auto' ],
            hover: [ primary[6], 'auto' ],
            focus: [ primary[6], 'auto' ],
            active: [ primary[6], 'auto' ]
        },
        secondary: {
            default: [ secondary[2], primary[3] ],
            hover: [ secondary[3], primary[3] ],
            focus: [ secondary[4], primary[3] ],
            active: [ primary[3], secondary[2] ]
        },
        link: {
            default: [ transparent, primary[5] ],
            hover: [ transparent, primary[6] ],
            focus: [ transparent, primary[6] ],
            active: [ transparent, primary[6] ]
        }
    }

    if(!accents[variant])
        return accents['primary'];

    return accents[variant];
}

export interface IButtonAccent {
    primary: IColor,
    secondary: IColor
}

export interface IButtonProps {
    variant?: 'primary' |'secondary' | 'minimal' | 'input' |  'link',
    shape?: 'fit' | 'square' | 'circle',
    size?: 'xs' | 'sm' | 'md' | 'lg',
    active?: boolean,
    disabled?: boolean,
    loading?: boolean,
    primary?: IColorPalette,
    secondary?: IColorPalette,
    as?: any,
    to?: string,
    className?: string,
    children?: React.ReactNode,
    [key: string]: any
}

const Button: React.FunctionComponent<IButtonProps> = ({
    variant = 'primary',
    shape = 'fit',
    size = 'md',
    active = false,
    disabled = false,
    loading = null,
    primary = blue,
    secondary = neutral,
    as = 'button',
    to,
    className,
    children,
    ...rest
}) => {
    const [ focusState, setFocusState ] = useState(false);

    const Element = (to ? Link : as);
    const accents = getAccents(primary, secondary, variant);

    const style = {
        '--Button-bg': accents.default[0],
        '--Button--hover-bg': accents.hover[0],
        '--Button--active-bg': accents.active[0],
        '--Button--focus-bg': accents.focus[0],
        '--Button-color': accents.default[1],
        '--Button--hover-color': accents.hover[1],
        '--Button--active-color': accents.active[1],
        '--Button--focus-color': accents.focus[1]
    } as React.CSSProperties;

    const renderLoadingIcon = () => (
       <LoadingIcon className="Button__LoadingIcon" size={14} /> 
    )


    return (
        <Element {...rest}
            className={classNames(
                'Button', 'd-flex', 'flex-row', 'flex-nowrap', 'gx-0', 'align-items-center',
                `Button--variant-${variant}`,
                `Button--shape-${shape}`,
                `Button--size-${size}`,
                {'Button--active': active},
                {'Button--loading': loading},
                {'Button--focus': focusState},
                className
            )}
            style={style}
            to={to}
            disabled={loading || disabled}
            onMouseDown={() => setFocusState(true)}
            onTouchStart={() => setFocusState(true)}
            onMouseUp={() => setFocusState(false)}
            onTouchEnd={() => setFocusState(false)}
            onMouseOut={() => setFocusState(false)}>
            {typeof loading == 'boolean' && renderLoadingIcon()}
            {children}
        </Element>
    )
}

export default Button;