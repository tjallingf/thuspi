import { useState, useRef } from 'react';
import Icon from '../components/Icon/Icon';
import InputText from '../components/Input/InputText';
import Button from '../components/Button';
import useTranslate from '../hooks/useTranslate';
import SilentForm from '../components/SilentForm';
import axios from 'axios';
import { emitEvent } from '../app/functions';

const Login = ({ onLogin }) => {
    const [ pwVisible, setPwVisible ] = useState(false);

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const togglePwVisible = () => {
        setPwVisible(!pwVisible);
    }

    const handleSubmit = async () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        const { status, data } = await axios.post('api/auth/login', {
            username, 
            password 
        });

        if(status === 200) {
            emitEvent(onLogin, {
                user: data.user
            });
        }
    }

    return (
        <div className="Login container align-items-center justify-content-center justify-content-md-start h-100">
            <SilentForm onSubmit={handleSubmit}>
                <div className="container mb-4">
                    <h3 className="tile-title">{useTranslate('pages.login.group.username.title')}</h3>
                    <InputText name="username" ref={usernameRef} variant="secondary" />
                </div>
                <div className="container mb-4">
                    <h3 className="tile-title">{useTranslate('pages.login.group.password.title')}</h3>
                    <div className="input-group">
                        <InputText type={pwVisible ? 'text' : 'password'} name="password" ref={passwordRef} variant="secondary" />
                        <Button accent="primary" color="blue" lightness={800} onClick={togglePwVisible}>
                            <Icon name={pwVisible ? 'eye' : 'eye-slash'} size="sm" library="fal" />
                        </Button>
                    </div>
                </div>
                <div className="container">
                    <div className="flex-row flex-nowrap">
                        <Button type="submit">
                            <Icon name="arrow-right-to-bracket" size="sm" library="fas" />
                            {useTranslate('generic.action.signIn')}
                        </Button>
                        <Button variant="link" color="blue">Ww vergeten?</Button>
                    </div>
                </div>
            </SilentForm>
        </div>
    )
}

export default Login;