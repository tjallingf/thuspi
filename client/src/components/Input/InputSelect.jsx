import { useState, useEffect } from 'react';
import Icon from '../Icon/Icon';
import Input from './Input';
import ContextMenu from '../Modal/ContextMenu';
import { emitEvent, mapObject, capitalize, isArray } from '../../app/functions';

const InputSelect = ({ name, options, onChange, onInput, selected: defaultSelected, plain = false, accent, className }) => {
    // return if `options` has no items
    if(!Object.keys(options)?.length) return;

    // if default selected item is undefined, set
    // it to the first item
    if (defaultSelected == undefined || options[defaultSelected] == undefined)
        defaultSelected = Object.keys(options)[0];
    
    const [ selected, __setSelected ] = useState(defaultSelected);

    useEffect(() => {
        const e = { target: {name, value: options[selected].value }}

        emitEvent(onInput, e);
        emitEvent(onChange, e);
    }, [selected]);

    const setSelected = (newSelected) => {
        if(options[newSelected] == undefined || options[newSelected].value == undefined)
            return false;

        __setSelected(newSelected);
    }

    const renderTrigger = () => {
        const selectedOption = (options[selected]?.length ? options[selected] : Object.values(options)[0]);

        return (
            <>
                <span className="input-select__selected">{selectedOption.label || selectedOption.value}</span>
                <Icon name="chevron-down" color={accent} className="input-select__icon" size="xs" />
            </>
        );
    }

    const getContextMenuItems = () => {
        return Object.values(mapObject(options, (option, key) => {
            return {
                title: capitalize(option.label || `${option.value}`),
                icon: option.icon,
                color: option.color,
                callback: setSelected,
                args: [key]
            }
        }))
    }

    return (
        <Input type="select" accent={accent} plain={plain} className={className}>
            <ContextMenu 
                trigger={renderTrigger()} 
                items={getContextMenuItems()}
                position={[100, 0]} />
        </Input>
    )
}

export default InputSelect;