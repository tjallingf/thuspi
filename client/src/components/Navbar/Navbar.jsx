import NavbarButton from './NavbarButton';
import { trim } from 'lodash';
import useUser from '../../hooks/useUser';
import { filter } from 'lodash';
import '../../styles/components/Navbar.scss';

const Navbar = ({ currentPage }) => {
    const user = useUser();

    const renderButton = ([ id, icon ]) => {
        const active = (trim(currentPage, '/') === id);
        return <NavbarButton key={id} id={id} target={`/${id}`} icon={icon} active={active} />;
    }

    const pages = [
        ['dashboard', 'house'],
        ['devices', 'plug'],
        ['recordings', 'chart-line'],
        ['flows', 'clock'],
        ['admin', 'wrench']
    ];

    const allowedPages = filter(pages, ([ pageId ]) => 
        user.hasPermission(`pages.view.${pageId}`));

    if(!allowedPages.length) return;

    return (
        <aside className="Navbar">
            {allowedPages.map(page => renderButton(page))}
        </aside>
    );
}

export default Navbar;