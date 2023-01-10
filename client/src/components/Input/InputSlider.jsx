import { useState } from 'react';
import Input from './Input';
import Modal from '../Modal/Modal';
import InputText from './InputText';
import AutoResizeInput from './AutoResizeInput';
import '../../styles/components/inputs/InputSlider.scss';
import ReactSlider from 'react-slider';

const InputSlider = ({min, max, step, symbol = '', value: defaultValue = 0, accent, className, onChange}) => {
    return (
        <Input type="slider-wrapper" accent={accent} className={className}>
            <ReactSlider 
                className="InputSlider"
                trackClassName="InputSlider__track"
                thumbClassName="InputSlider__thumb"
                value={defaultValue}
                min={min}
                max={max}
                step={step}
            />
        </Input>
    )
}

export default InputSlider;

// const InputSlider = ({min, max, step, value, symbol = '', style, onInput = ()=>{}, onChange = ()=>{}}) => {
//     const { useState, useEffect, useRef } = React;

//     const [dragging,   setDragging] = useState(false);
//     const [valueState, setValue]    = useState(value || 0)

//     const node  = useRef(null);
//     const $node = $(node.current);

//     const $track   = $node.find('.range-track');
//     const $thumb   = $node.find('.range-thumb');
//     const $tooltip = $node.find('.range-tooltip');

//     min   = typeof min == 'undefined'  ? 0   : parseFloat(min);
//     max   = typeof max == 'undefined'  ? 100 : parseFloat(max);
//     step  = typeof step == 'undefined' ? 1   : parseFloat(step);

//     const calcCenterValue = () => {
//         // get the center value of the range with respect to the step size
//         return valueToSteppedValue((max - min) / 2 + min);
//     }

//     const valueToSteppedValue = (value) => {
//         // get the closest value to the given value with respect to the step size
//         return Math.round(value / step) * step;
//     }

//     const thumbPosToSteppedValue = (thumbPos) => {   
//         const perc   = (thumbPos / $track.outerWidth()) * 100;
//         const value  = (max - min) * (perc / 100) + min;

//         return valueToSteppedValue(value);
//     }

//     const valueToThumbPos = (value) => {
//         if(!$track) return 0;

//         const perc = (value - min) / (max - min);
//         return perc * $track.outerWidth();
//     }

//     const getThumbPos = () => {
//         return clamp(0, pageX - $track.offset().left, $track.outerWidth())
//     }

//     const setThumbPos = (thumbPos) => {
//         $thumb.css('left', thumbPos+'px');
//     }

//     const setTooltip = (value) => {
//         if(!$tooltip) return;

//         $tooltip.text(`${value}${symbol}`);
//     }
    
//     const clickHandler = () => {
//         if(!$node.length || !$thumb.length) return;

//         const newThumbPos = pageX - $node.offset().left - $thumb.outerWidth() / 2;
//         const newValue    = thumbPosToSteppedValue(newThumbPos);
//         setThumbPos(newThumbPos);

//         setValue(newValue);

//         // fire onChange() callback
//         onChange({value: newValue});
//     }

//     value = (typeof value == 'undefined' ? calcCenterValue() : parseFloat(value));

//     // make thumb draggable
//     $thumb.draggable({
//         containment: 'parent',
//         axis: 'x',

//         drag: () => {
//             const newValue = thumbPosToSteppedValue(getThumbPos());
//             if(newValue == valueState) return;
//             setValue(newValue);
//         },

//         start: () => {
//             setDragging(true);

//             setValue(thumbPosToSteppedValue(getThumbPos()));
//         },

//         stop: () => {
//             setDragging(false);

//             const value = thumbPosToSteppedValue(getThumbPos());
//             setValue(value);

//             // fire onChange() callback
//             onChange({value: value});
//         }
//     });

//     useEffect(() => {
//         // move the thumb to currrent or middle value
//         setValue(value);

//         return () => {
//             if($thumb.data('ui-draggable')) $thumb.draggable('destroy');
//         }
//     }, []);

//     // fire onInput() callback when value state changes
//     useEffect(() => {
//         onInput({value: valueState});
//     }, [valueState])

//     return (
//         <div 
//                 className={`custom-input range ${dragging ? 'dragging' : ''}`}
//                 data-type="range"
//                 data-value={valueState}
//                 style={style}
//                 ref={node}
//                 onClick={clickHandler}>
//             <div className="range-track"></div>
//             <div className="range-thumb" style={dragging ? null : {left: valueToThumbPos(valueState)+'px'}}>
//                     <div className="range-tooltip">{setTooltip(valueState)}</div>
//                 </div>
//         </div>
//     )
// }