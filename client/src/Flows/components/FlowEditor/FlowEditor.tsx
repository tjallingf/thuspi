import React, { memo, useEffect, useState, useRef } from 'react';
import * as Blockly from 'blockly/core';
import '@blockly/field-date';
import '@blockly/block-plus-minus';
import BlocklyWorkspace from '@/Blockly/BlocklyWorkspace';
import FlowEditorBlock from '@/utils/flows/FlowEditorBlock';
import useQuery from '@/hooks/useQuery';
import { useIntl } from 'react-intl';
import fieldBlocks from '../../../utils/flows/blockly/fieldBlocks';
import '../../assets/blockly/custom-fields/index';
import useSocket from '@/hooks/useSocket';

export interface IFlowEditorProps {
    flowId: string;
    blocks: Array<{
        type: string;
        manifest: any;
    }>;
    blockCategories: Array<{
        extensionId: string;
        id: string;
        manifest: FlowBlockCategoryManifest;
    }>;
}
const FlowEditor: React.FunctionComponent<IFlowEditorProps> = memo(({ flowId, blocks, blockCategories }) => {
    const { formatMessage } = useIntl();
    const blocklyWorkspaceRef = useRef<Blockly.WorkspaceSvg>(null);
    const blocklySerializerRef = useRef(new Blockly.serialization.blocks.BlockSerializer());
    const [toolbox, setToolbox] = useState(null);
    const flowEditorBlocks = useRef<FlowEditorBlock[]>([]);

    const LOCAL_STORAGE_AUTOSAVE_KEY = `flows-${flowId}-autosaved`;

    function handleInject(workspace: Blockly.WorkspaceSvg) {
        blocklyWorkspaceRef.current = workspace;

        // Add change listener for autosaving
        blocklyWorkspaceRef.current.addChangeListener(handleChange);

        // Load the autosaved workspace
        loadAutoSavedWorkspace();
    }

    function handleChange(e) {
        if (['move', 'delete', 'change'].includes(e.type)) {
            autoSaveWorkspace();
        }
    }

    function autoSaveWorkspace() {
        console.log('autosave', blocklyWorkspaceRef.current);
        if (!blocklyWorkspaceRef.current) return;

        // Serialize the workspace
        const serializedState = blocklySerializerRef.current.save(blocklyWorkspaceRef.current);

        // Remove from the user's localStorage if the workspace is empty
        if (!serializedState) {
            localStorage.removeItem(LOCAL_STORAGE_AUTOSAVE_KEY);
            return;
        }

        // Store the serialized workspace in the user's localStorage
        localStorage.setItem(LOCAL_STORAGE_AUTOSAVE_KEY, JSON.stringify(serializedState));
    }

    function loadAutoSavedWorkspace() {
        try {
            const serializedState = localStorage.getItem(LOCAL_STORAGE_AUTOSAVE_KEY);
            if (serializedState.length) {
                blocklySerializerRef.current.load(JSON.parse(serializedState), blocklyWorkspaceRef.current);
            }
        } catch (err) {}
    }

    function registerBlocks() {
        // TODO: remove field blocks (see @zylax/core.logic_boolean)
        Blockly.defineBlocksWithJsonArray(fieldBlocks);

        blocks.forEach((block) => {
            if (!block.manifest) {
                console.error(`Invalid manifest for block '${block.type}': ${block.manifest}.`);
                return true;
            }

            const flowEditorBlock = new FlowEditorBlock(block.type, block.manifest, {
                messageFormatter: formatMessage,
                category: blockCategories.find((c) => c.id === block.manifest.category)?.manifest,
            });

            Blockly.Blocks[block.type] = flowEditorBlock.getBlocklyBlockDef();
            flowEditorBlocks.current.push(flowEditorBlock);
        });
    }

    function createToolbox() {
        // Build the toolbox
        const toolboxCategories = [];
        console.log({ blockCategories });
        blockCategories.forEach((category) => {
            const containsBlocks = flowEditorBlocks.current.filter((b) => b.manifest.category === category.id);
            console.log({ category, containsBlocks });
            const formattedName = formatMessage({
                id: `${category.extensionId}.flows.blockCategories.${category.id}.title`,
                defaultMessage: category.id,
            });

            toolboxCategories.push({
                kind: 'category',
                name: formattedName,
                contents: containsBlocks.map((b) => b.getBlocklyToolboxDef()),
            });
        });

        return {
            kind: 'categoryToolbox',
            contents: toolboxCategories,
        };
    }

    useEffect(() => {
        registerBlocks();
        setToolbox(createToolbox());
    }, []);

    console.log({ toolbox });
    if (!toolbox) return;

    return (
        <BlocklyWorkspace
            className="aaa"
            onInject={handleInject}
            injectOptions={{
                toolbox: toolbox,
                renderer: 'thrasos',
                sounds: false,
                scrollbars: true,
            }}
        />
    );
});

export default FlowEditor;
