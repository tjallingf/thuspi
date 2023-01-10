import Icon from '../Icon/Icon';
import AutoResizeInput from '../Input/AutoResizeInput';

const FlowBlockParameterString = (props) => {
    return (
        <>
            <Icon color={props.accent} size="xs" name="tick" className="w-auto" />
            <AutoResizeInput {...props} />
            <Icon color={props.accent} size="xs" name="tick" className="w-auto" />
        </>
    )
}

export default FlowBlockParameterString;
