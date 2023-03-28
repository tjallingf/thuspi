import App from './components/App';
import { createRoot } from 'react-dom/client';
import Providers from './components/Providers';
import { HashRouter } from 'react-router-dom';
import './styles/index.scss';

const root = createRoot(document.getElementById('root')!);
root.render(
    <Providers>
        <HashRouter>
            <App />
        </HashRouter>
    </Providers>
);