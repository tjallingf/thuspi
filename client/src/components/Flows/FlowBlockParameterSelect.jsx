import InputSelect from '../Input/InputSelect';
import { mapObject } from '../../app/functions';

const FlowBlockParameterSelect = (props) => {
    props = {
        ...props,
        options: mapObject(props.options, (option, key) => {
            // if(isArray(option)) {
            //     const [ value, icon, label, color ] = option;
            //     option = { value, icon, label, color };
            // }

            if (!option.label && typeof props.handleTranslate == 'function')
                option.label = props.handleTranslate(key);

            return {
                value: option.value,
                icon: option.icon,
                title: option.label,
                color: option.color
            };
        })
    };
    
    return <InputSelect {...props} />;
}

export default FlowBlockParameterSelect;