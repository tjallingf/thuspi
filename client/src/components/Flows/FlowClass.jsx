import Icon from '../Icon/Icon';
import InputSelect from '../Input/InputSelect';
import useTranslate from '../../hooks/useTranslate';

const FlowClass = ({ name, color, icon, groups, children }) => {
    const thresholdOptions = {
        every: [useTranslate('flows.class.condition.threshold.every')], 
        some: [useTranslate('flows.class.condition.threshold.some')]
    };

    const title = useTranslate(`flows.class.${name}.title`);

    return (
        <div className="flow-class">
            <div className="container-fluid">
                <div className="flow-class-title flex-row">
                    <Icon size="md" name={icon} color={color} />
                    <h2>{title}</h2>
                    { 
                        name == 'condition'
                        ? <InputSelect
                            accent={color}
                            options={thresholdOptions}
                            className="flow-class-select-threshold ms-2" />
                        : null
                    }
                </div>
                <div className="flow-groups flex-column">
                    {groups}
                </div>
            </div>
            {children}
        </div>
    )
}

export default FlowClass;