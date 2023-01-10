import { useState, useEffect, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import { getUniqueHex } from '../../app/functions';
import { emitEvent } from '../../helpers/functions';
import ModalContext from '../../contexts/ModalContext';
import useOutsideListener from '../../hooks/useOutsideListener';
import BackdropContext from '../../contexts/BackdropContext';
import '../../styles/components/Modal.scss';

const Modal = ({ 
    triggerRef, 
    children, 
    type, 
    show: defaultShow = false, 
    position = [0,0], 
    className = '',
    onShow,
    onHide
}) => {
    const [ id ] = useState(getUniqueHex(32));
    const [ show, setShow ] = useState(defaultShow);
    const [ backdropVisibleFor, setBackdropVisibleFor ] = useContext(BackdropContext);
    const [ register, unregister, modals ] = useContext(ModalContext);

    const modalRef = useRef(null);

    const handleTriggerClick = () => {
        setShow(true);
    }
    
    // Hide modal when clicked outside the modal and outside the trigger
    useOutsideListener(modalRef, e => {
        if(triggerRef.current && triggerRef.current.contains(e.target))
            return;

        setShow(false);
    })

    // Add 'click' listener on first render, remove it when unrendering
    useEffect(() => {     
        triggerRef.current.addEventListener('click', handleTriggerClick)

        return () => {
            triggerRef?.current?.removeEventListener('click', handleTriggerClick);
        }
    }, []);

    useEffect(() => {
        const numberOfVisibleModals = Object.values(modals).filter(modal => modal.type === type && modal.show)?.length + (show ? 1 : 0);
        setBackdropVisibleFor(type, numberOfVisibleModals > 0);

        if(show) {
            emitEvent(onShow, { value: true });
        } else {
            emitEvent(onHide, { value: true });
        }
    }, [ show ]);

    // Unregister modal on every unrender
    useEffect(() => {
        return () => { 
            unregister(id);
        }
    })

    const renderModal = () => {
        if(triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            var style = {
                top: triggerRect.top + (position[0] / 100 * triggerRect.height),
                left: triggerRect.left + (position[1] / 100 * triggerRect.width)
            };
        }

        return (
            <div 
                    ref={modalRef}
                    id={`Modal-${id}`}
                    className={`Modal Modal--type-${type} ${show ? 'Modal--visible' : ''} ${className}`}
                    style={style}>
                {children}
            </div>
        )
    }
    
    return (
        <>
            {createPortal(renderModal(), document.getElementById('modal-root'))}
        </>
    )
}

export default Modal;