import { useEffect } from 'react';
import ModalContext from '../contexts/ModalContext';

const ModalProvider = ({ children }) => {
    let modals = {};
    
    useEffect(() => {
        return () => { modals = {} };
    }, [])

    const register = (id, type, show) => {
        modals[id] = { type, show };
    }

    const unregister = (id) => {
        delete modals[id];
    }

    return <ModalContext.Provider value={[register, unregister, modals]}>{children}</ModalContext.Provider>
}

export default ModalProvider;