import Tile from '../components/Tile/Tile';
import Button from '../components/Button';
import Icon from '../components/Icon/Icon';

const AdminSystem = () => {
    return (
        <div className="AdminSystem container">
            <Tile title="Status">
                <div className="flex-column">
                    <div className="flex-column text-muted">
                        <span>PID: XXXX</span>
                        <span>Online since: XX-XX-XXXX XX:XX</span>
                    </div>
                    <div className="flex-row">
                    <Button color="green" disabled>
                            <Icon name="play" />
                            Start
                        </Button>
                        <Button color="yellow">
                            <Icon name="arrow-rotate-right" />
                            Restart
                        </Button>
                        <Button color="red">
                            <Icon name="power-off" />
                            Stop
                        </Button>
                    </div>
                </div>
            </Tile>
        </div>
    )
}

export default AdminSystem;