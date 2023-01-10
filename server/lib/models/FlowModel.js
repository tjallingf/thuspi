const FlowController = require('@controllers/FlowController');
const Model = require('@models/Model');
const ExtensionModel = require('@models/ExtensionModel');
const ConfigController = require('@controllers/ConfigController');
const _ = require('lodash');
const { PromiseAllObject } = require('@lib/helpers');

const RUN_AT_INTERVAL = parseInt(ConfigController.find('system.flows.runAtInterval'));

class FlowModel extends Model {
    constructor(id, props) {
        return super(id, props);
    }

    evaluateTrigger() {
        return new Promise((resolve, reject) => {
            const blockId = this.props.structure.trigger;

            this.executeBlock(blockId).then(output => {
                return resolve(this.#evaluateBlockOutput(output));
            }).catch(err => {
                return reject(err);
            })
        })
    }

    evaluateCondition() {
        return new Promise((resolve, reject) => {
            if(!Object.keys(this.props.structure.condition).length)
                return resolve(false);
            
            // Condition blocks are executed asynchronously
            Promise.all(
                _.map(this.props.structure.condition.groups, (group, groupId) => {
                    return new Promise((resolve, reject) => {
                        Promise.all(
                            _.map(group.blocks, blockId => {
                                return new Promise((resolve, reject) => {
                                    this.executeBlock(blockId).then(output => {
                                        return resolve(this.#evaluateBlockOutput(output));
                                    }).catch(err => {
                                        return reject(err);
                                    })
                                })
                            })
                        ).then(outputs => {
                            return resolve({
                                ...group,
                                outputs 
                            });
                        }).catch(err => {
                            return resolve(err);
                        });
                    })
                })
            ).then(groups => {
                // Convert the output to a boolean value, determining
                // whether the condition has been met or not
                return resolve(this.#evaluateGroupOutput({
                    outputs: groups.map(group => {
                        return this.#evaluateGroupOutput(group)
                    })
                }));
            })
        })
    }

    executeAction() {
        return new Promise(async (resolve, reject) => {
            console.log(`Succesfully executed action of ${this.toString()}`);
            
            // Action blocks are executed synchronously
            for (const groupId in this.props.structure.action.groups) {
                const group = this.props.structure.action.groups[groupId];

                for (const blockId of group.blocks) {
                    await this.executeBlock(blockId);
                }
            }
        })
    }

    getBlock(blockId) {
        return this.props.blocks[blockId];
    }

    async executeBlock(blockId) {
        return new Promise(async (resolve, reject) => {
            const block = this.getBlock(blockId);
            const [ blockExtensionId, blockCategory, blockName ] = block.type.split('/');
            const extension = new ExtensionModel(blockExtensionId);

            // If a block is passed as a parameter, run that block first and
            // use it's output as the parameter value
            const parameters = await PromiseAllObject(_.mapValues(block.parameters, async parameter => 
                parameter.isBlock 
                    ? await this.executeBlock(parameter.value)
                    : parameter.value
            ));

            const output = await extension.executeItem(`flow_blocks/${blockCategory}/${blockName}/block`, [
                {
                    parameters
                }
            ]);
            
            return resolve(output.data);
        })
    }

    #evaluateGroupOutput(group) {
        switch(group.connector) {
            case 'or':
                return group.outputs.reduce((prev, cur) =>
                    (prev || cur), false);
            default:
                return group.outputs.reduce((prev, cur) =>
                    (prev && cur), true);
        }
    }

    // Converts block output to a boolean
    #evaluateBlockOutput(output) {
        if(output?.constructor?.name === 'Date') {
            if(isNaN(output)) return false;

            const diff = output.getTime() - Date.now();
            return (diff >= 0 && diff < RUN_AT_INTERVAL * 1000);
        }

        return !!output;
    }

    validate() {};
}

module.exports = FlowModel;