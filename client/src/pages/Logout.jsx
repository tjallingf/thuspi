import { useState, useEffect } from 'react';
import { emitEvent } from '../app/functions';
import useUser from '../hooks/useUser';
import LoadingIcon from '../components/Icon/LoadingIcon';
import axios from 'axios';
import useTranslate from '../hooks/useTranslate';
import Button from '../components/Button';

const Logout = ({ onLogout }) => {   
    const user = useUser();
    const [ isLoggedOut, setIsLoggedOut ] = useState(user.id == 'default');

    useEffect(() => {
        if(!isLoggedOut) {
            setTimeout(() => {
                axios.get('api/auth/logout')
                    .then(({ status, data }) => {
                        setIsLoggedOut(true);
                        emitEvent(onLogout, {
                            user: data.user
                        });
                    })
            }, 250);
        }
    }, [])
    
    if(!isLoggedOut)
        return (
            <div className="Logout container">
                <LoadingIcon 
                    center 
                    delay={0}
                    label={<span>{useTranslate('pages.logout.loading.label')}</span>} />
            </div>
        );
        
    return (
        <div className="Logout container align-items-center justify-content-center justify-content-md-start h-100">
            <h1 className="mb-1">{useTranslate('pages.logout.success.label')}</h1>
            <Button to="/login">{useTranslate('pages.logout.loginAgain.label')}</Button>
        </div>
    )
}

export default Logout;