import Icon from './Icon/Icon';
import useTranslate from '../hooks/useTranslate';
import Button from './Button';
import ContextMenu from './Modal/ContextMenu';
import useUser from '../hooks/useUser';
import { useRef } from 'react';
import '../styles/components/Topbar.scss';

const Topbar = ({ currentPage }) => {
    const accountTriggerRef = useRef(null);
    const user = useUser();

    const getAccountContextMenuItems = () => {
        if(user.id == 'default') 
            return [{
                id: 'account.logIn',
                icon: 'arrow-right-to-bracket',
                to: '/login'
            }];

        return [{
            id: 'account.settings',
            icon: 'cog',
            to: '/account/settings'
        }, {
            id: 'account.logOut',
            icon: 'arrow-right-from-bracket',
            to: '/logout'
        }];
    }

    return (
        <header className="Topbar">
            <div className="container flex-row">
                <h1 className="page-title">{useTranslate(`pages.${currentPage}.title`)}</h1>
                <div className="ms-auto flex-row gx-5">
                    <Button accent="transparent" color="text-primary">
                        <Icon name="magnifying-glass" size="sm" />
                    </Button>
                    <Button accent="transparent" ref={accountTriggerRef} color="text-primary">
                        {user.getProp('hasPicture') 
                            ? <Icon src={`api/users/${user.id}/picture`} size="md" className="rounded-circle" />
                            : <Icon name="user" size="md" /> }
                    </Button>
                    <ContextMenu 
                        triggerRef={accountTriggerRef}
                        position={[100, 0]}
                        items={getAccountContextMenuItems()}
                    />
                </div>
            </div>
        </header>
    )
}

export default Topbar;