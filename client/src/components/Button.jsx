import '../styles/components/Button.scss';
import { Link } from 'react-router-dom';
import { forwardRef } from 'react';
import classNames from 'classnames';

const Button = forwardRef(({ 
    variant = 'primary', 
    className = '',
    size = 'md',
    color = 'text-secondary',
    colorHover,
    colorActive,
    accent = 'blue', 
    accentHover,
    accentActive,
    active,
    disabled,
    to, 
    onClick, 
    children, 
    type = 'button'
}, ref) => {
    const useColor = (color, defaultLightness, fallbackColor) => {
        let lightness = defaultLightness;
        if(typeof color == 'object' && color.length == 2) {
            [ color, lightness ] = color;
        }

        if(!color && fallbackColor)
            return useColor(fallbackColor, lightness);

        const varName = includeLightness(color) ? `${color}-${lightness}` : color;
        return color == 'inherit' ? 'inherit' : `var(--${varName})`;
    }

    const includeLightness = (color = '') => {
        if(color == 'inherit') return;
        return !(color.endsWith('-primary') || color.endsWith('-secondary') || color.endsWith('-tertiary'));
    }

    const styles = {
        '--Button-accent': useColor(accent, 500),
        '--Button--hover-accent': useColor(accentHover, 400, accent),
        '--Button--active-accent': useColor(accentActive, 500, accent),
        '--Button-color': useColor(color, 500),
        '--Button--hover-color': useColor(colorHover, 400, color),
        '--Button--active-color': useColor(colorActive, 500, color),
        '--Button-padding': `var(--Button--size-${size}-padding)`,
        '--Button-border-radius': `var(--Button--size-${size}-border-radius)`
    };

    const Element = (to ? Link : 'button');

    return (
        <Element 
                ref={ref}
                className={classNames(
                    'Button',
                    `Button--${variant}`,
                    className,
                    {
                        'Button--active': active,
                        'Button--disabled': disabled
                    })}
                style={styles}
                onClick={onClick}
                to={to ? to : null}
                type={type}>
            {children}
        </Element>   
    )
})

export default Button;