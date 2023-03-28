import { ReactNode, FunctionComponent } from 'react';
import classNames from 'classnames';
import '@/styles/components/Inputs/TextInput.scss';
import Box from '../Box';

export interface ITextInputProps {
    className?: string,
    prefix?: ReactNode,
    suffix?: ReactNode
    [key: string]: any
}

const TextInput: FunctionComponent<ITextInputProps> = ({
    className,
    prefix,
    suffix,
    ...rest
}) => {
    return (
        <Box className="TextInput-wrapper" align="stretch">
            {prefix}
            <input {...rest}
                className={classNames('TextInput', 'w-100', className)} />
            {suffix}
        </Box>
    )
}

export default TextInput;