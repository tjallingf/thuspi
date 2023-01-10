import Icon from '../Icon/Icon';
import Button from '../Button';
import useTranslate from '../../hooks/useTranslate';
import '../../styles/components/NavbarButton.scss';

const NavbarButton = ({ id, target, icon, active }) => {
    return (
        <Button 
                key={id} 
                className="NavbarButton" 
                variant="link"
                color="text-primary"
                colorActive="blue"
                to={target}
                active={!!active}>
            <Icon 
                size="md" 
                name={icon}
                className="NavbarButton__Icon" />
            <span className="NavbarButton__text">{useTranslate(`pages.${id}.title`)}</span>
        </Button>
    )
}

export default NavbarButton;