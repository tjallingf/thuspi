import ContextMenu from '../Modal/ContextMenu';
import Modal from '../Modal/Modal';
import Icon from '../Icon/Icon';
import Button from '../Button';

const TileAction = ({ contextMenuItems, modalChildren, iconName = 'fal.ellipsis-vertical' }) => {
    const renderButton = () => {
        return (
            <Button className="tile__action" color="text-primary">
                <Icon 
                    name={iconName} 
                    size="xs" />
            </Button>
        )
    }

    return (
        contextMenuItems
            ? <ContextMenu trigger={renderButton()} items={contextMenuItems} />
            : <Modal>{modalChildren}</Modal>
    )
}

export default TileAction;