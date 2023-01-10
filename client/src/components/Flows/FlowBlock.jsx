import { useContext } from 'react';
import useTranslate from '../../hooks/useTranslate';
import Icon from '../Icon/Icon';
import FlowBlockParameter from './FlowBlockParameter';
import FlowContext from '../../contexts/FlowContext';

const FlowBlock = ({ id, onChange }) => {
    const { getBlock } = useContext(FlowContext);
    const { props, category, manifest, extension } = getBlock(id);

    if(props == undefined || category == undefined || manifest == undefined || extension == undefined)
        return;

    const typeName = props.type.split('/').pop();

    const getTitleFields = () => {
        const title = useTranslate(`flow_blocks.${category.name}/${typeName}.title`, null, extension.name) || '';

        // seperate parameters and text fields
        let parts = title.includes('%') ? title.split(/(%\S+)/).map(item => item.trim()) : [title];

        // if first item of `parts` is an empty string, remove it
        // the above happens when the title immediately starts with a parameter
        if (parts[0] == '') parts = parts.slice(1);

        return parts;
    }
    
    const handleChange = (originalEvent) => {
        const e = { block: props, target: originalEvent.target }

        if(typeof onChange == 'function')
            onChange(e);
    } 

    const renderTitle = () => {
        return getTitleFields().map((field, index) => {
            const fieldType = (field.startsWith('%') ? 'parameter' : 'text');

            if(fieldType == 'parameter') {
                const name = field.substring(1);

                if(!props.parameters || props.parameters[name] == undefined || !manifest?.parameters || !manifest.parameters[name])
                    return;

                const value = props.parameters[name];

                return <FlowBlockParameter 
                    key={index} 
                    plain={true} 
                    name={name} 
                    value={value} 
                    block={{ ...props, category, manifest }} 
                    config={manifest.parameters[name]}
                    onChange={handleChange}
                    onNestedBlockChange={onChange} />;
            } else {
                return <span className="flow-block-text">{field}</span>;
            }
        })
    }

    return (
        <div className="tile flow-block gy-2 btn active-btn-primary-dk">
            <h3 className="tile-title flex-row gx-0">{renderTitle()}</h3>
            <div className="tile-footer flex-row">
                <span className="text-muted me-1">{useTranslate(`flow_blocks.${category.name}.title`, null, extension.name)}</span>
                <Icon size="sm" name={manifest?.icon} color={category?.color} className="ms-auto" />
            </div>
        </div>
    );
}

export default FlowBlock;