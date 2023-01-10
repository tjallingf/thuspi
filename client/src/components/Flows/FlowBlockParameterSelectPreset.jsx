import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import FlowBlockParameterSelect from './FlowBlockParameterSelect';
import FlowContext from '../../contexts/FlowContext';

const FlowBlockParameterSelectPreset = (props) => {
    const { id } = useParams();
    const [ options, setOptions ] = useState({});
    const { getPresetOptions } = useContext(FlowContext);

    useEffect(() => {
        const fetchPresetOptions = () => {
            let options = {};

            Promise.all(props.presets.map(([presetId, filter]) => {
                return getPresetOptions(presetId, filter, id);
            })).then(items => {
                items.forEach((res) => {
                    options = {...options, ...res};
                });

                setOptions(options);
            })
        }

        fetchPresetOptions();
    }, []);

    return <FlowBlockParameterSelect options={options} {...props} />;
}

export default FlowBlockParameterSelectPreset;