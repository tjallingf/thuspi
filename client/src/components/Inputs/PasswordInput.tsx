import React from 'react';
import { useState } from 'react';
import InputGroup from '../InputGroup';
import TextInput from './TextInput';
import Button from '../Button';
import Icon from '../Icon';

export interface IPasswordInputProps {
    className?: string,
    revealable?: boolean,
    [key: string]: any
}

const PasswordInput: React.FunctionComponent<IPasswordInputProps> = ({
    revealable,
    ...rest
}) => {
    const [ isHidden, setisHidden ] = useState(true);

    const suffix = revealable && (
        <Button type="button" variant="input" onClick={() => setisHidden(cur => !cur)}>
            <Icon id={isHidden ? 'eye-slash' : 'eye'} size={16} />
        </Button>
    );

    return (
        <TextInput {...rest} type={isHidden ? 'password' : 'text'} suffix={suffix} />
    )
}

export default PasswordInput;