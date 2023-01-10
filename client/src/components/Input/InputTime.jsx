import { clamp, emitEvent, padZero } from '../../app/functions';
import Input from './Input';
import AutoResizeInput from './AutoResizeInput';
import '../../styles/components/inputs/InputTime.scss';

const InputTime = ({ name, value: defaultValue, onInput, onChange, plain = true, accent, withSeconds = false }) => {
    let hours   = parseInt(defaultValue.split(':')[0]) || 0;
    let mins    = parseInt(defaultValue.split(':')[1]) || 0;
    let secs    = parseInt(defaultValue.split(':')[2]) || 0;

    const handleInput = (event) => {
        const field = event.target.name;
        const value = parseInt(event.target.value) || 0;

        if(field == 'hours')
            hours = (clamp(0, value, 23));
        else if(field == 'mins')
            mins = (clamp(0, value, 59));
        else if(field == 'secs')
            secs = (clamp(0, value, 59));

        const e = { target: { 
            name, 
            value: `${toStrValue(hours)}:${toStrValue(mins)}:${toStrValue(secs)}` 
        }};

        return emitEvent(onInput, e);
    }

    const handleBlur = () => {
        const e = { target: { 
            name, 
            value: `${toStrValue(hours)}:${toStrValue(mins)}:${toStrValue(secs)}` 
        }};

        return emitEvent(onChange, e);
    }

    const toStrValue = (num) => {
        return padZero(num);
    }

    const renderTrigger = () => {
        return (
            <Input type="time" plain={plain} accent={accent}>
                <AutoResizeInput name="hours" type="text" onInput={handleInput} onBlur={handleBlur} value={toStrValue(hours)} allowChars="0123456789" min={0} max={23} length={2} />
                <span>:</span>
                <AutoResizeInput name="mins" type="text" onInput={handleInput} onBlur={handleBlur} value={toStrValue(mins)} allowChars="0123456789" min={0} max={59} length={2} />
                {!!withSeconds ? (
                    <>
                        <span>:</span>
                        <AutoResizeInput name="secs" type="text" onInput={handleInput} onBlur={handleBlur} value={toStrValue(secs)} allowChars="0123456789" min={0} max={59} length={2} />
                    </>
                ) : null} 
            </Input>
        );
    }

    return (
        renderTrigger()
    )
}

export default InputTime;