import { emitEvent } from '../../app/functions';
import Input from './Input';
import AutoResizeInput from './AutoResizeInput';
import '../../styles/components/inputs/InputNumber.scss';

const InputNumber = ({ name, min, max, step, value: defaultValue, plain = false, accent, onInput, onChange, placeholder }) => {
    let value = defaultValue;

    const handleInput = (e) => {
        value = parseFloat(e.target.value) || 0;
        emitEvent(onInput, {target: {name, value}});
    }

    const handleChange = (e) => {
        value = parseFloat(e.target.value) || 0;
        emitEvent(onChange, {target: {name, value}});
    }

    const handleKeyDown = (e) => {
        console.log('keydown', e);
    }

    return (
        <Input type='number' plain={plain} accent={accent}>
            <AutoResizeInput 
                type='number' 
                plain={plain} 
                name={name} 
                onKeyDown={handleKeyDown} 
                onInput={handleInput} 
                onChange={handleChange} 
                value={value} 
                allowChars='0123456789.,'
                placeholder={placeholder} />
        </Input>
    )
}

export default InputNumber;