// TODO: Add translations for aria-label (see Topbar Button[to="/login"])
// TODO: Hide animated form labels when a value is present
import { Navbar, Topbar, Icon, Box, Button, Container } from '@tjallingf/react-utils';
import { Routes, Route } from 'react-router-dom';
import useTrimmedLocation from '@/hooks/useTrimmedLocation';
import { FormattedMessage } from 'react-intl';

import FlowEdit from './Flows/pages/FlowEdit.page';
import Recordings from '@/Recordings/pages/Recordings.page';
import Devices from '@/Devices/pages/Devices.page';
import Login from '@/Login/pages/Login.page';

const App: React.FunctionComponent = () => {
  const { pathname } = useTrimmedLocation();

  return (
    <>
      <Topbar>
        <Container>
          <Box direction="row" align="center">
            <h1 className="Topbar__title">
              {<FormattedMessage id={`@zylax/core.pages.${pathname.split('/')[1]}.title`} />}
            </h1>
            <div className="ms-auto">
              <Button variant="secondary" to="/login" shape="square" size="lg" aria-label="Visit the login page">
                <Icon id="user" size={20} />
              </Button>
            </div>
          </Box>
        </Container>
      </Topbar>
      <Navbar show={true}>
        <Navbar.Button icon={<Icon id="home" />} to="/dashboard" />
        <Navbar.Button icon={<Icon id="plug" />} to="/devices" />
        <Navbar.Button icon={<Icon id="chart-simple" />} to="/recordings" />
        <Navbar.Button icon={<Icon id="clock" />} to="/flows" />
        <Navbar.Button icon={<Icon id="wrench" />} to="/admin" />
      </Navbar>
      <Routes>
        <Route path="/devices" element={<Devices />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recordings" element={<Recordings />} />
        <Route path="/flows/:id/edit" element={<FlowEdit />} />
      </Routes>
    </>
  );
};

export default App;
