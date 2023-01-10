import { useState } from 'react';
import BackdropContext from '../contexts/BackdropContext';

const BackdropProvider = ({ children }) => {
    const [ visibleFor, setVisibleFor ] = useState({});

    const makeVisibleFor = (modalType, state) => {
        setVisibleFor(cur => {
            if(state)
                cur[modalType] = true;
            else
                delete cur[modalType];

            return {...cur};
        });
    }

    return (
        <BackdropContext.Provider value={[ Object.keys(visibleFor), makeVisibleFor ]}>
            { children }
        </BackdropContext.Provider>
    )
}

export default BackdropProvider;