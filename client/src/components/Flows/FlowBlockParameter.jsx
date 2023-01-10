import useTranslate from '../../hooks/useTranslate';
import { emitEvent } from '../../app/functions';
import FlowBlock from './FlowBlock';
import InputTime from '../Input/InputTime';
import InputNumber from '../Input/InputNumber';
import FlowBlockParameterSelect from './FlowBlockParameterSelect';
import FlowBlockParameterSelectPreset from './FlowBlockParameterSelectPreset';
import FlowBlockParameterString from './FlowBlockParameterString';

const FlowBlockParameter = ({ name, value, config, block, plain = false, onChange, onNestedBlockChange }) => {   
    const [extensionId, categoryId, blockId] = block.type.split('/');

    const hasNestedBlock = (value?.ref != undefined);

    const handleTranslate = (key) => {
        return useTranslate(`flow_blocks.${categoryId}/${blockId}.${name}.${key}.label`, null, extensionId) || key;
    }

    const handleChange = (originalEvent) => {  
        if(hasNestedBlock) {
            return emitEvent(onNestedBlockChange, originalEvent);
        }

        const event = { target: {name, value: originalEvent.target.value }};
        return emitEvent(onChange, event);
    }

    const renderRef = () => {
        const [blockId, refParamName] = value.ref.split('/');
        if(refParamName != 'return')
            return;

        return <FlowBlock id={blockId} onChange={handleChange} />
    }

    const renderParameter = () => {
        switch(config.type) {
            case 'time':
                return <InputTime 
                    name={name}
                    value={value}
                    onChange={handleChange}
                    plain={plain} 
                    accent={block.category.color} />;
            case 'timeWithSeconds':
                return <InputTime 
                    name={name}
                    value={value}
                    onChange={handleChange}
                    plain={plain} 
                    accent={block.category.color}
                    withSeconds={true} />;
            case 'select':
                return <FlowBlockParameterSelect 
                    name={name}
                    selected={value}
                    onChange={handleChange}
                    plain={plain}
                    accent={block.category.color} 
                    options={config.options} 
                    handleTranslate={handleTranslate} />;
            case 'selectPreset':
                return <FlowBlockParameterSelectPreset 
                    name={name}
                    selected={value} 
                    onChange={handleChange}
                    plain={plain} 
                    accent={block.category.color}
                    presets={config.options} 
                    handleTranslate={handleTranslate} />;
            case 'number':
                return <InputNumber 
                    name={name}
                    value={value == undefined ? (config.default || config.min || 0) : value}
                    onChange={handleChange}
                    plain={plain} 
                    accent={block.category.color}
                    placeholder={config.default || config.min || '0'} />
            case 'string':
                return <FlowBlockParameterString 
                        name={name}
                        value={value == undefined ? (config.default || config.min || 0) : value}
                        onChange={handleChange}
                        plain={plain} 
                        accent={block.category.color}
                        placeholder={config.default || config.min || '0'} />
        }
    }

    return (
        <div className="flow-block-parameter">
            {value.ref ? renderRef() : renderParameter()}
        </div>
    )
}

export default FlowBlockParameter;