import { useContext } from 'react';
import BackdropContext from '../../contexts/BackdropContext';
import '../../styles/components/Backdrop.scss';

const Backdrop = () => {
    const [ visibleFor ] = useContext(BackdropContext);

    return <div className={`Backdrop ${visibleFor.map(modalType => `Backdrop--visible_${modalType}`)}`}></div>
}

export default Backdrop;