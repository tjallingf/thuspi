// TODO: Add translations for aria-label (see Topbar Button[to="/login"])
// TODO: Hide animated form labels when a value is present
import React from 'react';
import Navbar from './Navbar';
import Topbar from './Topbar';
import { Routes, Route } from 'react-router-dom';
import useTrimmedLocation from '@/hooks/useTrimmedLocation';

import Devices from '@/pages/Devices';
import Device from '@/pages/Device';
import Login from '@/pages/Login';

const App: React.FunctionComponent = () => {
    const { pathname } = useTrimmedLocation();

    return (
        <>
            <Topbar title="Devices" />
            {pathname != '/login' && <Navbar />}
            <main>
                <Routes>
                    <Route path="/devices" element={<Devices />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </main>
        </>
    )
}

export default App;