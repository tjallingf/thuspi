import Tile from '../components/Tile/Tile';
import Button from '../components/Button';
import Icon from '../components/Icon/Icon';

const Admin = () => {
    return (
        <div className="Admin container">
            <div className="row">
                <Button variant="link" to="/admin/system/">
                    <Tile iconName="cog" iconColor="blue" title="System" />
                </Button>
                <Button variant="link" to="/admin/devices/">
                    <Tile iconName="plug" iconColor="blue" title="Devices" />
                </Button>
                <Button variant="link" to="/admin/log/">
                    <Tile iconName="list" iconColor="blue" title="Log" />
                </Button>
            </div>
        </div>
    )
}

export default Admin;