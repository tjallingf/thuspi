import _ from 'lodash';
import { Node, AbstractNode } from '../DashboardWidget';
import TextNode from './TextNode';

/**
 * Convert text strings to a TextNode.
 */
export function parseNode(node: AbstractNode): Node {
    if(typeof node === 'string') return new TextNode(node);
    return node;
}

export function createComponent<T>(render: (props: T) => AbstractNode) {
    return (props: T = {} as T, ...children: AbstractNode[]): Node => {
        let parsedChildren = children.map(parseNode);
        return parseNode(render({ ...props, children: parsedChildren }));
    };
}