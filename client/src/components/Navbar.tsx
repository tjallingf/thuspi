import React from 'react';
import useAuth from '@/hooks/useAuth';
import Button from './Button';
import Icon from './Icon';
import { textPrimary, textMuted, transparent } from '@/utils/theme/colors';
import { blue } from '@/utils/theme/colorpalettes';
import { useLocation } from 'react-router';
import '@/styles/components/Navbar.scss';
import { trim } from 'lodash';

export interface INavbarProps {
    children?: React.ReactNode
}

const Navbar: React.FunctionComponent<INavbarProps> = ({
    children
}) => {
    const { user } = useAuth();
    const location = useLocation();

    const renderButton = ({ id, icon, to }: { id: string, icon: string, to: string }) => {
        const active = trim(location.pathname, '/').startsWith(trim(id, '/'));

        return (
            <Button 
                key={id} 
                variant="link"
                active={active}
                shape="square"
                size="lg"
                to={to}
                className="Navbar__Button">
            <Icon 
                size={20} 
                id={icon} />
        </Button>
        )
    }

    return (
        <aside className="Navbar">
            {renderButton({ id: 'dashboard', icon: 'home', to: '/dashboard' })}
            {renderButton({ id: 'devices', icon: 'plug', to: '/devices' })}
            {renderButton({ id: 'recordings', icon: 'chart-simple', to: '/recordings' })}
            {renderButton({ id: 'flows', icon: 'clock', to: '/flows' })}
            {renderButton({ id: 'admin', icon: 'wrench', to: '/admin' })}
        </aside>
    )
}

export default Navbar;