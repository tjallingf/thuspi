import { HexColorPicker } from 'react-colorful';
import { useRef } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button';
import Icon from '../Icon/Icon';

const InputColorPicker = ({ accent, value, onChange }) => {
    const triggerRef = useRef(null);

    return (
        <>
            <Button size="sm" ref={triggerRef} accent={accent}>
                <Icon name="paintbrush-fine" size="sm" />
            </Button>
            <Modal position={[100,0]} triggerRef={triggerRef}>
                <HexColorPicker
                    color={value}
                    onChange={color => onChange?.apply(null, [{ value: color }])} />
            </Modal>
        </>
    )
}

export default InputColorPicker;