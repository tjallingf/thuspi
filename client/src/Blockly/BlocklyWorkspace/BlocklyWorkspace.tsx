import React, { useRef, useEffect, memo } from 'react';
// import * as Blockly from 'blockly';
import * as Blockly from 'blockly/core';
import classNames from 'classnames';
import './BlocklyWorkspace.scss';

export interface IBlocklyWorkspaceProps extends React.HTMLAttributes<HTMLDivElement> {
    injectOptions?: Blockly.BlocklyOptions;
}

const BlocklyWorkspace: React.FunctionComponent<IBlocklyWorkspaceProps> = memo(
    ({ injectOptions, className, ...rest }) => {
        console.log('rerender!');
        const ref = useRef(null);

        useEffect(() => {
            if (!ref.current) {
                throw new Error('Failed to inject Blockly, ref.current is invalid.');
            }

            Blockly.inject(ref.current, injectOptions);
        }, []);

        return <div {...rest} ref={ref} className={classNames('BlocklyWorkspace', className)}></div>;
    },
);

export default BlocklyWorkspace;
