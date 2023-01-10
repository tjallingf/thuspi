import { useState, forwardRef } from 'react';
import { padZero, emitEvent } from '../../app/functions';
import Icon from '../Icon/Icon';
import Input from './Input';
import classNames from 'classnames';
import '../../styles/components/inputs/InputText.scss';

const InputText = forwardRef(({
    accent,
    allowChars,
    className,
    icon,
    length,
    max,
    min,
    name,
    onBlur,
    onChange,
    onInput,
    placeholder,
    symbol,
    type = 'text',
    format = 'text',
    value: defaultValue,
    variant = 'primary',
    ...rest
}, ref) => {
    const [ value, setValue ] = useState(defaultValue);

    const handleInput = (e) => {
        let value = e.target.value;

        // remove chars that are not allowed
        if (allowChars?.length)
            value = value.split('').filter(char => allowChars.includes(char)).join('');

        if(format == 'number') {
            value = parseFloat(value);
            if(min != undefined) value = Math.max(min, value)
            if(max != undefined) value = Math.min(max, value)
            if(length != undefined) value = padZero(value, length).substr(0, length);
        }

        setValue(value);
        return emitEvent(onInput, { target: { name, value: parseValue(value) }});
    }

    const handleBlur = (e) => {
        emitEvent(onBlur, e);
        return emitEvent(onChange, { target: { name, value: parseValue(value) }});
    }

    const parseValue = (value) => {
        switch(format) {
            case 'number':
                return parseFloat(value.replace(',', '.'));
            default:
                return value;
        }
    }

    const renderInput = () => {        
        return (
            <input {...rest}
                ref={ref}
                type={type}
                onInput={handleInput}
                onBlur={handleBlur}
                name={name}
                placeholder={placeholder}
                className={classNames(
                    'Input',
                    'InputText',
                    `InputText--${variant}`,
                    className
                )} />
        );
    }

    return (
        <Input type="text-wrapper" accent={accent}>
            {icon || symbol 
                ? (
                    <div className={`input-group ${className || ''}`}>
                        {renderInput(true)}
                        <div className="input-group-text">
                            {icon 
                                ? <Icon className="input-text__icon" name={icon} size="xs" />
                                : <span className="input-text__symbol">{symbol}</span>}
                        </div>
                    </div>
                )
                : renderInput()}
        </Input>
    )
})

export default InputText;