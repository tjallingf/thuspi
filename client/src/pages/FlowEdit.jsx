import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import { mapObject } from '../app/functions';
import FlowBlock from '../components/Flows/FlowBlock';
import FlowClass from '../components/Flows/FlowClass';
import FlowGroup from '../components/Flows/FlowGroup';
import FlowGroupAdd from '../components/Flows/FlowGroupAdd';
import Icon from '../components/Icon/Icon';
import axios from 'axios';
import '../styles/pages/flows.scss';

const FlowEdit = () => {
    const { id } = useParams();

    const [ flow, setFlow ] = useState(null);

    useEffect(() => {
        (async () => setFlow((await axios.get(`api/flows/${id}`)).data))();
    }, []);

    const handleChange = (e) => {
        setFlow(oldFlow => {
            let newFlow = {...oldFlow};
            newFlow.blocks[e.block.id] = recompileBlock(e, newFlow.blocks[e.block.id]);
            // console.log(JSON.stringify(newFlow));
            return newFlow;
        })
    }

    const recompileBlock = (event, oldBlock) => {
        try {
            let newParameters = {};
        
            // filter out parameters from oldBlock that are unused
            mapObject(event.block.manifest.parameters || {}, (config, name) => {
                newParameters[name] = (name == event.target.name ? event.target.value : oldBlock.parameters[name])
            })

            return {
                type: event.block.type,
                parameters: newParameters
            }
        } catch(err) {
            console.error(err);
            return oldBlock;
        }
    }

    const renderGroups = (className) => {
        return Object.entries(flow.classes[className].groups).map(([groupId, group]) => (
            <>
                <FlowGroup key={groupId}>
                    {group.blocks.map(blockId => (
                        <FlowBlock key={blockId} id={blockId} onChange={handleChange} />
                    ))}
                </FlowGroup>
            </>
        ))
    }

    if(!flow)
        return;

    console.log('render!');

    return (
        <div className="FlowEdit container">
            <FlowClass name="condition" icon="fal.bolt" color="yellow" groups={renderGroups('condition')}>
                <FlowGroupAdd />
            </FlowClass>
            <FlowClass name="action" icon="fal.check-circle" color="green" groups={renderGroups('action')} />
            <button className="btn btn-floating btn-green">
                <Icon size="xxl" name="save" />
            </button>
        </div>
    )
}

export default FlowEdit;