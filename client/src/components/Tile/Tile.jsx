import Icon from '../Icon/Icon';
import '../../styles/components/Tile.scss';

const Tile = ({ title, iconName, iconColor, children }) => {
    return (
        <div className="Tile">
            <div className="Tile__header flex-row">
                {iconName && <div className="Tile__icon me-1 mb-auto"><Icon name={iconName} color={iconColor}/></div>}
                {title && <h3 className="Tile__title">{title}</h3>}
            </div>
            {children && <div className="Tile__content">{children}</div>}
        </div>
    );
}

export default Tile;