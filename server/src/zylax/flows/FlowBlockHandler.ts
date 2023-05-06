import { ExtensionController } from '../extensions';
import Model from '../lib/Model';
import { PromiseAllSettledObject } from '../utils/Promise';
import Flow, { FlowBlockConfig } from './Flow';
import FlowBlock from './FlowBlock/FlowBlock';
import FlowBlockManifest from './FlowBlockManifest';
import dayjs from 'dayjs';
import _ from 'lodash';

export interface FlowBlockArgs {
    [key: string]: any;
}

export default class FlowBlockHandler extends Model {
    // config: FlowBlockConfig;
    // flow: Flow;
    // block: FlowBlock;
    // blockManifest: FlowBlockManifest;
    // err: Error;
    // constructor(config: FlowBlockConfig, flow: Flow) {
    //     super(config.id);
    //     this.config = config;
    //     this.flow = flow;
    //     try {
    //         const FlowBlockModule = ExtensionController.findModule(FlowBlock, config.type);
    //         this.block = new FlowBlockModule();
    //         this.blockManifest = this.block.getManifest();
    //     } catch(err) {
    //         this.err = err;
    //     }
    // }
    // resolveArgs(){
    //     return new Promise<FlowBlockArgs>((resolve, reject) => {
    //         const args = this.config.arguments;
    //         // Variable for storing argument values, some of which may be promises.
    //         let settledArguments = {};
    //         _.forOwn(args, (valueRef, name) => {
    //             const param = this.blockManifest.getParameters().find(p => p.getName() === name);
    //             // Continue if no parameter with this name exists.
    //             if(!param) {
    //                 this.logger.warn(`${this.block} does not have any parameter '${name}', skipping argument.`);
    //                 return true;
    //             }
    //             switch(valueRef[0]) {
    //                 case 'block':
    //                     const blockHandler = this.flow.getBlockHandler(valueRef[1]);
    //                     settledArguments[name] = blockHandler.execute();
    //                     break;
    //                 case 'value':
    //                     settledArguments[name] = valueRef[1];
    //                     break;
    //                 default:
    //                     throw new Error(`Invalid argument reference: [${valueRef[0]}, ${valueRef[1]}].`);
    //             }
    //         })
    //         // Wait until all promises have settled.
    //         PromiseAllSettledObject(settledArguments).then(results => {
    //             _.forOwn(results, (result, name) => {
    //                 if(result.status != 'fulfilled')
    //                     return reject(`Failed to resolve argument '${name}'.`);
    //             })
    //             return resolve(settledArguments);
    //         })
    //     })
    // }
    // execute() {
    //     return new Promise<any>(async (resolve, reject) => {
    //         if(this.err) {
    //             return reject(this.err);
    //         }
    //         const args = this.convertArgs(await this.resolveArgs());
    //         const output = this.block.run(args);
    //         return resolve(output);
    //     })
    // }
    // /**
    //  * Convert arguments to the desired type.
    //  * @param args The arguments to convert.
    //  */
    // private convertArgs(args: FlowBlockArgs): FlowBlockArgs {
    //     let convertedArgs = {};
    //     const params = this.blockManifest.getParameters();
    //     // Convert or remove any arguments
    //     _.forOwn(args, (value, name) => {
    //         // Find the corresponding parameter by name
    //         const param = params.find(p => p.name === name);
    //         // Convert the argument value
    //         convertedArgs[name] = this.convertValue(value, param.type)
    //     })
    //     // Check for any missing arguments
    //     params.forEach(param => {
    //         if(typeof convertedArgs[param.name] === 'undefined') {
    //             this.logger.warn(`Argument '${param.name}' is ${convertedArgs[param.name]}, expected ${param.type[0]}.`);
    //         }
    //     })
    //     return convertedArgs;
    // }
    // private convertValue(value: string, paramType: string[]) {
    //     switch(paramType[0].toLowerCase()) {
    //         case 'string':
    //             return (typeof value.toString() === 'function' ? value.toString() : value+'');
    //         case 'number':
    //             return parseFloat(value);
    //         case 'time':
    //             let formats = [ undefined, paramType[1], 'HH:mm:ss', 'HH:mm', 'HH' ];
    //             // Loop over the formats to try and parse the date
    //             let parsed: Date = null;
    //             formats.every(format => {
    //                 parsed = dayjs(value, format).toDate();
    //                 // If the parsed date is invalid, try the next format
    //                 if(isNaN(parsed.getTime())) return true;
    //             })
    //             return parsed;
    //         case 'date':
    //             return dayjs(value).toDate();
    //         case 'boolean':
    //             return !!value;
    //     }
    // }
}
