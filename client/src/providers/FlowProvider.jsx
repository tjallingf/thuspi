import { useState, useEffect } from 'react';
import FlowContext from '../contexts/FlowContext';

const FlowProvider = ({ children }) => {
    // const [ flow, setFlow ] = useState(null);
    // const [ blockTypes, setBlockTypes ] = useState(null);
    
    // const getBlock = (id) => {
    //     try {
    //         if(!flow || !blockTypes)
    //             throw new Error('Reading flow blocks before all data has been fetched.');

    //         const props = flow.blocks[id];
    //         if(props == undefined)
    //             throw new Error(`Cannot find flow block "${id}"`);

    //         const [ extensionName, categoryName, typeName ] = props.type.split('/');

    //         const category = blockTypes[extensionName][categoryName]?.manifest;
    //         const manifest = blockTypes[extensionName][`${categoryName}/${typeName}`]?.manifest;

    //         return { 
    //             props, 
    //             category: { ...category, name: categoryName }, 
    //             manifest, 
    //             extension: { name: extensionName } 
    //         };
    //     } catch(err) {
    //         console.error(err);
    //         return {};
    //     }
    // }

    // const getPresetOptions = async (presetId, filter) => {
    //     return new Promise(async resolve => {
    //         try {
    //             if(!flow || !blockTypes)
    //                 throw new Error('Reading flow blocks before all data has been fetched.');

    //             const res = await useFetch(
    //                 `flows/${flow.id}/presetoptions/${presetId}`, 
    //                 { query: { filter: encodeURIComponent(JSON.stringify(filter)) } }
    //             );

    //             return resolve(res);
    //         } catch(err) {
    //             console.error(err);
    //             return resolve({});
    //         }
    //     })
    // }

    // return (
    //     <FlowContext.Provider value={{ flow, setFlow, blockTypes, setBlockTypes, getBlock, getPresetOptions }}>
    //         { children }
    //     </FlowContext.Provider>
    // )
}

export default FlowProvider;