import fieldBlocks from './blockly/fieldBlocks';
import { IntlShape } from 'react-intl';
import { forOwn } from 'lodash';
import { moveKeyToProperty } from '../array';
import { FlowBlockCategoryManifest } from '@server/flows/FlowBlockCategory';
import { getColorValue } from '../colors';
import { colorpalettes } from '@tjallingf/react-utils';

export interface FlowEditorBlockOptions {
    messageFormatter: IntlShape['formatMessage'];
    onChange?: (event: string, data: any) => void;
    category: FlowBlockCategoryManifest;
}

export interface FlowEditorBlockFormattedManifest {
    category: string;
    connections?: {
        top?: boolean;
        bottom?: boolean;
    };
    helpUrl?: string;
    output?: {
        type?: string;
    };
    parameters?: Array<{
        blockly: any;
        name: string;
        type?: string;
        options?: any[];
        shadow?: {
            type?: string;
            value?: any;
        };
    }>;
    statements?: Array<{
        name: string;
    }>;
}

export default class FlowEditorBlock {
    type: string;
    extensionId: string;
    blockName: string;
    options: FlowEditorBlockOptions;
    manifest: FlowEditorBlockFormattedManifest;

    constructor(type: string, manifest: any, options: FlowEditorBlockOptions) {
        this.type = type;
        this.manifest = this.formatManifest(manifest);
        this.options = options;

        [this.extensionId, this.blockName] = type.split('.');
    }

    formatManifest(unformatted: any): FlowEditorBlockFormattedManifest {
        return {
            ...unformatted,
            parameters: moveKeyToProperty(unformatted.parameters || {}, 'name'),
            statements: moveKeyToProperty(unformatted.statements || {}, 'name'),
        };
    }

    getBlocklyToolboxDef() {
        let inputs = {};
        this.manifest.parameters.forEach((param: any) => {
            // Dropdown fields can't have a shadow block
            if (param.options) return true;

            const shadow = this.getShadow(param);

            // Prevent a block from having itself as a shadow (this is the case with math_number etc.)
            if (shadow?.type === this.type) return;

            if (!shadow) {
                console.error(
                    `No field block exists for parameter type '${param.type}', used in parameter '${param.name}'.`,
                );
                return true;
            }

            inputs[param.name] = {
                shadow: shadow,
            };
        });

        return {
            kind: 'block',
            type: this.type,
            inputs: inputs,
        };
    }

    getBlocklyParameterDefJSON(param: FlowEditorBlockFormattedManifest['parameters'][0]) {
        if (param.options) {
            const options = param.options.map((option) => this.#formatOptionLabel(option, param));

            return {
                name: param.name,
                type: 'field_dropdown',
                options: options,
                ...(param.blockly || {}),
            };
        }

        return {
            name: param.name,
            type: 'input_value',
            check: param.type === 'any' ? null : param.type,
            ...(param.blockly || {}),
        };
    }

    getShadow(param: FlowEditorBlockFormattedManifest['parameters'][0]) {
        let shadowType = param.type;

        if (typeof param.shadow?.type === 'string' && (param.shadow.type === param.type || param.type === 'any')) {
            shadowType = param.shadow.type;
        }

        switch (shadowType) {
            case 'boolean':
                return {
                    type: '@zylax/core.logic_boolean',
                    fields: {
                        VALUE: 'true',
                    },
                };
            case 'string':
                return {
                    type: '__type_string__',
                    fields: {
                        VALUE: 'true',
                    },
                };
            case 'number':
                return {
                    type: '@zylax/core.math_number',
                    fields: {
                        VALUE: param.shadow?.value ?? 3,
                    },
                };
            default:
                return null;
        }
    }

    getBlocklyBlockDef() {
        const jsonDef = this.getBlocklyBlockDefJSON();
        const originalThis = this;

        return {
            init: function () {
                this.jsonInit(jsonDef);
            },

            onchange: function (e: any) {
                if (this.isInFlyout) return;
                if (this.id !== e.blockId) return;

                originalThis.options.onChange?.(e.type, e);

                // switch (e.type) {
                //     case 'move':
                //         originalThis.emit('move');
                //         break;
                //     case 'change':
                //         const param = originalThis.manifest.parameters.find((p) => p.name === e.name);
                //         if (!param) return;

                //         originalThis.#emitEvent('change', {
                //             name: e.name,
                //             oldValue: parseFieldValue(e.oldValue, param.type),
                //             newValue: parseFieldValue(e.newValue, param.type),
                //         });
                //         break;
                //     default:
                //         return;
                // }
            },
        };
    }

    getBlockColour(): string | number {
        // If the color is a number (hue) or a hex color, return the color as is.
        if (typeof this.options.category?.color === 'number' || this.options.category?.color?.startsWith?.('#')) {
            return this.options.category.color;
        }

        // Get the corresponding color palette, fallling back to blue if it doesn't exist.
        const colorpalette = colorpalettes[this.options.category?.color] || colorpalettes['blue'];
        return getColorValue(colorpalette[4]);
    }

    getBlocklyBlockDefJSON() {
        const def = {
            type: this.type,

            previousStatement: this.manifest.connections?.top === false ? undefined : null,
            nextStatement: this.manifest.connections?.top === false ? undefined : null,

            helpUrl: this.manifest.helpUrl,

            inputsInline: true,
            colour: this.getBlockColour(),
            output: this.manifest.output?.type,
        };

        def['args0'] = this.manifest.parameters.map((p) => this.getBlocklyParameterDefJSON(p));
        def['message0'] = this.#formatMessage(this.manifest.parameters);

        this.manifest.statements.forEach((statement, i) => {
            def[`args${i + 1}`] = [
                {
                    name: statement.name,
                    type: 'input_statement',
                },
            ];

            // Translate the statement label. The default message is a space character,
            // because an empty string is treated as a missing message.
            let message = this.options.messageFormatter({
                id: `${this.extensionId}.flows.blocks.${this.blockName}.statements.${statement.name}.label`,
                defaultMessage: ' ',
            });

            // Trim any spaces from the message and append the placeholder.
            // When a message is missing, it will only be the placeholder.
            message = message.trim() + '%1';

            def[`message${i + 1}`] = message;
        });

        return def;
    }

    #formatOptionLabel(option, param): [string, any] {
        let { value, label, key } = option;

        // Force label and value to be a string
        label = label + '';
        value = value + '';

        // If a key is defined, get the translated label
        if (key) {
            label = this.options.messageFormatter({
                id: `${this.extensionId}.flows.blocks.${this.blockName}.parameters.${param.name}.options.${key}.label`,
                defaultMessage: key || label || value,
            });
        }

        return [label, value];
    }

    #formatMessage(params: any[]) {
        let defaultMessage = params.map((_, i) => `%${i + 1}`).join(' ');

        let values = {};
        params.forEach((param, i) => (values[param.name] = `%${i + 1}`));

        const formattedMessage = this.options.messageFormatter(
            {
                id: `${this.extensionId}.flows.blocks.${this.blockName}.label`,
                defaultMessage: defaultMessage,
            },
            values,
        );

        return formattedMessage;
    }
}
