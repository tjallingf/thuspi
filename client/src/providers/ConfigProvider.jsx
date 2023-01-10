import { useState } from 'react';
import ConfigContext from '../contexts/ConfigContext';

const ConfigProvider = ({ children }) => {
    const [ config, setConfig ] = useState(null);

    return (
        <ConfigContext.Provider value={[ config, setConfig ]}>
            { children }
        </ConfigContext.Provider>
    )
}

export default ConfigProvider;