import React, { useRef, memo } from 'react';
import * as Blockly from 'blockly/core';
import '@blockly/field-date';
import '@blockly/block-plus-minus';
import BlocklyWorkspace from '@/Blockly/BlocklyWorkspace';
import FlowBlock from '@/utils/flows/FlowBlock';
import useQuery from '@/hooks/useQuery';
import { useIntl } from 'react-intl';
import fieldBlocks from '../../../utils/flows/blockly/fieldBlocks';
import '../../assets/blockly/custom-fields/index';

export interface IFlowBlocklyEditorProps {}

export type IBlocksResult = Array<{
    type: string;
    manifest: any;
}>;

const FlowBlocklyEditor: React.FunctionComponent<IFlowBlocklyEditorProps> = memo(({}) => {
    let blocksDefined = useRef(false);
    const blocks = useQuery<IBlocksResult>('flows/blocks');
    const { formatMessage } = useIntl();

    if (blocks.isLoading) return <span>Loading blocks...</span>;

    let toolbox = {
        kind: 'flyoutToolbox',
        contents: [],
    };

    // Define the blocks
    if (!blocksDefined.current) {
        blocksDefined.current = true;

        Blockly.defineBlocksWithJsonArray(fieldBlocks);
        blocks.result.forEach((block) => {
            const flowBlock = new FlowBlock(block.type, block.manifest, formatMessage);
            Blockly.Blocks[block.type] = flowBlock.getBlocklyBlockDef();

            // Add the block to the toolbox
            toolbox.contents.push(flowBlock.getBlocklyToolboxDef());
        });
        // }));

        // var toolbox = {
        //     kind: 'flyoutToolbox',
        //     contents: []
        // };

        // blocks.result.forEach(({ blocklyDef }) => {
        //     let inputs = {};

        //     blocklyDef.args0.forEach(arg => {
        //         if(arg.check === 'Number') {
        //             inputs[arg.name] = {
        //                 block: {
        //                     type: '__NUMBER__',
        //                     fields: {
        //                         VALUE: 3
        //                     }
        //                 }
        //             };
        //         }
        //     })

        //     toolbox.contents.push({
        //         kind: 'block',
        //         type: blocklyDef.type,
        //         inputs: inputs
        //     })
        // })
    }

    return (
        <BlocklyWorkspace
            className="aaa"
            injectOptions={{
                toolbox: toolbox,
                renderer: 'thrasos',
                sounds: false,
                scrollbars: true,
            }}
        />
    );
});

export default FlowBlocklyEditor;
