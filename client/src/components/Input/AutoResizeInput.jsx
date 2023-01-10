import { useRef, useState, useEffect } from 'react';
import { padZero, emitEvent } from '../../app/functions';
import InputText from './InputText';

const AutoResizeInput = (props) => {
    const { name, onInput, type = 'text', onChange, plain = false, value: defaultValue, allowChars = '', placeholder, length, min, max } = props;

    const [value, setValue] = useState(defaultValue+'');

    const inputRef = useRef(null);
    const spanRef = useRef(null);

    useEffect(() => {
        spanRef.current.textContent = ((value+'')?.length ? value : placeholder);
        inputRef.current.style.width = spanRef.current.offsetWidth + 'px';
    }, [value]);

    const handleInput = (e) => {
        let value = e.target.value;

        // remove chars that are not allowed
        if (allowChars.length)
            value = value.split('').filter(char => allowChars.includes(char)).join('');

        if(type == 'number') {
            value = parseFloat(value);

            if(min != undefined)
                value = Math.max(min, value)
            
            if(max != undefined)
                value = Math.min(max, value)

            if(length != undefined)
                value = padZero(value, length).substr(0, length);
        }

        setValue(value);
        return emitEvent(onInput, {target: {name, value: value}});
    }

    return <>
        <InputText {...props}
            type="text"
            ref={inputRef} 
            style={{boxSizing: 'content-box'}}
            onInput={handleInput}
            onBlur={onChange}
            className={plain ? 'input-plain' : ''} />
        <span ref={spanRef} 
            style={{position: 'absolute', height: 0, overflow: 'hidden', whiteSpace: 'pre'}} />
    </>
}

export default AutoResizeInput;