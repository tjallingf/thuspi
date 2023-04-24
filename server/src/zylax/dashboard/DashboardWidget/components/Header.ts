import { createComponent } from '../utils';
import { Node } from '../../DashboardWidget';
import HtmlNode from '../HtmlNode';

export interface HeaderProps {
    color?: string,
    name?: string,
    children?: Node[]
}

const Header = createComponent<HeaderProps>(({ color, name, children }) => {
    return new HtmlNode(
        'span', { className: color }, 
        new HtmlNode('div', { className: 'hello!' }),
        ...children
    );
})

export default Header;