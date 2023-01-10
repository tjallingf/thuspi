import { Link } from 'react-router-dom';
import Modal from './Modal';
import useTranslate from '../../hooks/useTranslate';
import { unescapeEntities } from '../../app/functions';
import Icon from '../Icon/Icon';
import useUser from '../../hooks/useUser';
import '../../styles/components/ContextMenu.scss';
import Button from '../Button';

const ContextMenu = ({ items, header, position, className, show, triggerRef, onShow, onHide }) => {
    const user = useUser();

    const handleClick = (callback, args = []) => {
        if(typeof callback == 'function')
            callback.apply(null, args);
    }

    const renderItem = ({ title, icon, callback, args, thumbnail, to, id, color, description = '', permission } = {}) => {
        if(permission != undefined && !user.hasPermission(permission))
            return;

        if(id != undefined && title == undefined)
            title = useTranslate(`contextMenu.item.${id}.title`);

        if(title == undefined)
            return;

        return (
            <Button key={id}
                    accent="primary" 
                    lightness={800}
                    className="ContextMenu__item"
                    color="text-primary"
                    onClick={() => handleClick(callback, args)}
                    to={typeof to == 'string' ? to : null}>
                {thumbnail ? <img src={thumbnail} className="ContextMenu__item__thumbnail" /> : null}
                {icon && !thumbnail ? <Icon size="md" className="ContextMenu__item__icon" name={icon} color={color ? color : null} library="fal" /> : null}
                <div className="ContextMenu__item__content flex-column gy-0">
                    <span className="ContextMenu__item__title">{unescapeEntities(title)}</span> 
                    <span className="ContextMenu__item__description text-muted">{unescapeEntities(description)}</span> 
                </div>
            </Button>
        );
    }

    const renderEmptyItem = () => {
        return renderItem({ title: 'Er zijn geen items LOL.'});
    }

    const renderItems = () => {
        return (items.length ? items.map(renderItem) : renderEmptyItem());
    }

    return (
        <Modal 
                triggerRef={triggerRef} 
                type="ContextMenu" 
                className={className} 
                position={position} 
                show={show}
                onShow={onShow}
                onHide={onHide}>
            {header && <div className="ContextMenu__header">{header}</div>}
            <div className="ContextMenu__items">
                {renderItems()}
            </div>  
        </Modal>
    )
}

export default ContextMenu;