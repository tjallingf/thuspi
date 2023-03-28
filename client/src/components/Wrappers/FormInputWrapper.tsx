import React from 'react';

export interface IFormInputWrapperProps {
   children?: React.ReactNode,
   ref?: any,
   overrideProps: object
}

const FormInputWrapper: React.FunctionComponent<IFormInputWrapperProps> = ({
    children,
    overrideProps
}) => {
    if(!React.isValidElement(children)) return null;

    return React.cloneElement(children, overrideProps as React.Attributes);
}

export default FormInputWrapper;