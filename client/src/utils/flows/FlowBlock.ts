import * as Blockly from 'blockly/core';
import fieldBlocks from './blockly/fieldBlocks';
import { IntlShape } from 'react-intl';
import { parseFieldValue } from './helpers';
import fetchQuery from '../fetchQuery';
import { IBlocksResult } from '@/Flows/components/FlowBlocklyEditor/FlowBlocklyEditor';

export default class FlowBlock {
    type: string;
    manifest;
    extensionId: string;
    blockName: string;
    intlFormatMessage: IntlShape['formatMessage'];

    constructor(type: string, manifest, intlFormatMessage: IntlShape['formatMessage']) {
        this.type = type;
        this.manifest = manifest;
        this.intlFormatMessage = intlFormatMessage;

        [this.extensionId, this.blockName] = type.split('.');
    }

    getBlocklyToolboxDef() {
        let inputs = {};
        this.manifest.parameters.forEach((param: any) => {
            if (param.options) return true;

            const fieldBlock = fieldBlocks.find((b) => b.type === `__type_${param.type}__`);
            if (!fieldBlock) {
                console.error(
                    `No field block exists for parameter type '${param.type}', used in parameter '${param.name}'.`,
                );
                return true;
            }

            inputs[param.name] = {
                shadow: {
                    type: fieldBlock.type,
                    fields: {
                        VALUE: param.type === 'number' ? 3 : 'aa',
                    },
                },
            };
        });

        return {
            kind: 'block',
            type: this.type,
            inputs: inputs,
        };
    }

    getBlocklyParameterDefJSON(param) {
        if (param.options) {
            const options = param.options.map((option) => this.#formatOptionLabel(option, param));
            return {
                options: options,
                name: param.name,
                type: 'field_dropdown',
            };
        }

        return {
            name: param.name,
            type: 'input_value',
            check: param.type,
        };
    }

    async #emitEvent(event: string, data: any) {
        const { result } = await fetchQuery<IBlocksResult>('flows/blocks/events', {
            method: 'patch',
            data: {
                blockTypes: [this.type],
                event: event,
                data: data,
            },
        });
    }

    getBlocklyBlockDef() {
        const jsonDef = this.getBlocklyBlockDefJSON();
        const flowBlock = this;

        return {
            init: function () {
                this.jsonInit(jsonDef);
            },

            onchange: function (e) {
                if (this.isInFlyout) return;
                if (this.id !== e.blockId) return;
                console.log({ e });

                switch (e.type) {
                    case 'move':
                        if (flowBlock.manifest.listeners.includes('move')) {
                            flowBlock.#emitEvent('move', {});
                        }
                        break;
                    case 'change':
                        const param = flowBlock.manifest.parameters.find((p) => p.name === e.name);
                        if (!param) return;

                        flowBlock.#emitEvent('change', {
                            name: e.name,
                            oldValue: parseFieldValue(e.oldValue, param.type),
                            newValue: parseFieldValue(e.newValue, param.type),
                        });
                        break;
                    default:
                        return;
                }
            },
        };
    }

    getBlocklyBlockDefJSON() {
        const args0 = this.manifest.parameters.map((p: any) => this.getBlocklyParameterDefJSON(p));

        // For accepting children
        let args1;
        if (this.manifest.allowChildren === true) {
            args1 = [
                {
                    type: 'input_statement',
                    name: 'CHILDREN',
                },
            ];
        }

        return {
            type: this.type,

            message0: this.#formatMessage(args0),
            args0: args0,

            message1: args1 ? '%1' : undefined,
            args1: args1,

            previousStatement: this.manifest.allowTopConnection === false ? undefined : null,
            nextStatement: this.manifest.allowBottomConnection === false ? undefined : null,

            helpUrl: this.manifest.helpUrl,

            inputsInline: true,
            colour: 360,
        };
    }

    #formatOptionLabel(option, param): [string, any] {
        let { value, label, key } = option;

        // Force label and value to be a string
        label = label + '';
        value = value + '';

        // If a key is defined, get the translated label
        if (key) {
            label = this.intlFormatMessage({
                id: `${this.extensionId}.flows.blocks.${this.blockName}.parameters.${param.name}.options.${key}.label`,
                defaultMessage: key || label || value,
            });
        }

        return [label, value];
    }

    #formatMessage(args: any[]) {
        const defaultMessage = args.map((_, i) => `%${i + 1}`).join(' ');

        let values = {};
        args.forEach((arg, i) => (values[arg.name] = `%${i + 1}`));

        return this.intlFormatMessage(
            {
                id: `${this.extensionId}.flows.blocks.${this.blockName}.label`,
                defaultMessage: defaultMessage,
            },
            values,
        );
    }
}
