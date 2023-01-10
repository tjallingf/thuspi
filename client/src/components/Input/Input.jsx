import '../../styles/components/inputs/Input.scss';
import { capitalize } from 'lodash';
import { forwardRef } from 'react';

const Input = forwardRef((props, ref) => {
    let accentStyles = {};

    for (let i = 1; i <= 9; i++) {
        const lightness = i*100;
        accentStyles[`--Input-accent-${lightness}`] = `var(--${props.accent}-${lightness})`;
    }

    return (
        <div {...props}
                className={`Input Input${capitalize(props.type)} ${props.className || ''}`}
                data-value={props.value}
                style={accentStyles}
                ref={ref}>
            {props.children}
        </div>
    )
})

export default Input;