import { randomBytes } from 'crypto';
import ExtensionModule from '../extensions/ExtensionModule';
import * as widgetComponents from './DashboardWidget/components';
import type HtmlNode from './DashboardWidget/HtmlNode';
import type TextNode from './DashboardWidget/TextNode';
import { parseNode } from './DashboardWidget/utils';

export type Node = HtmlNode | TextNode;
export type AbstractNode = Node | string;

export default class DashboardWidget extends ExtensionModule {
    static components = widgetComponents;
    private state = {};

    constructor() {
        super();
        console.log(this.serialize());
    }
    
    render(): AbstractNode {
        return;
    }

    serialize(): any {
        return {
            document: parseNode(this.render()).toJSON(),
            requests: this.requests
        }
    }
}