import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import Topbar from './Topbar';
import Navbar from './Navbar/Navbar';
import Backdrop from './Modal/Backdrop';

// Pages
import Admin from '../pages/Admin';
import AdminDevices from '../pages/AdminDevices';
import AdminDevicesDevice from '../pages/AdminDevicesDevice';
import AdminSystem from '../pages/AdminSystem';
import AdminLog from '../pages/AdminLog';
import Dashboard from '../pages/Dashboard';
import Devices from '../pages/Devices';
import FlowEdit from '../pages/FlowEdit';
import Login from '../pages/Login';
import Logout from '../pages/Logout';
import Recordings from '../pages/Recordings';

import BackdropProvider from '../providers/BackdropProvider';
import ModalProvider from '../providers/ModalProvider';

import { TranslateProvider } from '../hooks/useTranslate';
import { UserProvider } from '../hooks/useUser';
import { ExtensionManifestProvider } from '../hooks/useExtensionManifest';

import UserModel from '../app/models/UserModel';
import axios from 'axios';
import { trim } from 'lodash';
import '../styles/components/App.scss';
import '../styles/main.scss';

const App = () => {
    const [ userId, setUserId ] = useState('me');
    const [ user, setUser ] = useState(null);
    const [ translations, setTranslations ] = useState(null);
    const [ extensions, setExtensions ] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {       
        (async () => {
            let user = new UserModel((await axios.get('api/users/me')).data);
            // Load user data
            setUser(user);

            // Load translations
            setTranslations((
                await axios.get(`api/locale/${user.getSetting('locale') ?? 'en_us'}`)).data);
            
            if(location.pathname != '/logout')
                navigate('/'+(user.getSetting('homePageId') || 'dashboard'));
        })();

        // Load extensions
        (async () => setExtensions((
            await axios.get(`api/extensions`)).data))();
    }, [ userId ]);

    useEffect(() => {
        if(!user) return;
        document.documentElement.setAttribute('data-theme', user.getSetting('theme') || '');
    }, [ user ]);

    const handleLogin = ({ user }) => {
        setUserId(user.id);
    }

    const handleLogout = ({ user }) => {
        setUserId(user.id);
    }

    const currentPage = trim(location.pathname, '/');
    document.getElementById('root').setAttribute('data-page', currentPage);

    if(!user || !translations || !extensions)
        return;

    return (
        <div className="App">
            <UserProvider user={user}>
                <TranslateProvider translations={translations}>
                    <ExtensionManifestProvider extensions={extensions}>
                        <ModalProvider>
                            <BackdropProvider>
                                <Backdrop />
                                <Topbar currentPage={currentPage} />
                                <main className="container-fluid">
                                    <Routes>
                                        <Route exact path="/admin/" element={<Admin />} />
                                        <Route exact path="/admin/devices/" element={<AdminDevices />} />
                                        <Route exact path="/admin/devices/:id/" element={<AdminDevicesDevice />} />
                                        <Route exact path="/admin/system/" element={<AdminSystem />} />
                                        <Route exact path="/admin/log/" element={<AdminLog />} />

                                        <Route exact path="/login/" element={<Login onLogin={handleLogin} />} />
                                        <Route exact path="/logout/" element={<Logout onLogout={handleLogout} />} />
                                        <Route exact path="/devices/" element={<Devices/>} />
                                        <Route exact path="/recordings/" element={<Recordings/>} />
                                        <Route exact path="/dashboard/" element={<Dashboard/>} />
                                        <Route exact path="/admin/" element={<Dashboard/>} />
                                        <Route exact path="/flows/:id/edit/" element={<FlowEdit />} />
                                    </Routes>
                                </main>
                                <Navbar currentPage={currentPage} />
                            </BackdropProvider>
                        </ModalProvider>
                    </ExtensionManifestProvider>
                </TranslateProvider>
            </UserProvider>
        </div>
    )
}

export default App;