import { useState, useEffect } from 'react';
import useEffectExceptOnMount from '../../hooks/useEffectExceptOnMount';
import { emitEvent } from '../../app/functions';
import Input from './Input';
import '../../styles/components/inputs/InputSwitch.scss';

const InputSwitch = ({ onInput, onChange, value: defaultValue = false, accent, className }) => {   
    const [ value, setValue ] = useState(defaultValue);
    
    useEffectExceptOnMount(() => {
        emitEvent(onInput, { value });
        emitEvent(onChange, { value });
    }, [ value ]);
    
    return (
        <Input  type="switch"
                onClick={() => setValue(current => !current)} 
                accent={accent} 
                className={className}
                value={value}>
            <div className="InputSwitch__track">
                <div className="InputSwitch__thumb"></div>
            </div>
        </Input>
    )
}

export default InputSwitch;