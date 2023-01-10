import { Link } from 'react-router-dom';
import Icon from '../Icon/Icon';
import TileAction from '../Tile/TileAction';
import { dateGetMidnight } from '../../app/functions';

const Recording = ({ id, name, icon, value, color, asSkeleton = false }) => {
    const contextMenuItems = [
        {
            icon: 'fal.calendar',
            id: 'recordings.viewGraph',
            to: `/recordings/${id}/graph/`,
            permission: `recordings.view.${id}`
        },
        {
            icon: 'fal.calendar-day',
            id: 'recordings.viewGraphToday',
            to: `/recordings/${id}/graph/?from=${dateGetMidnight(Date.now())}`,
            permission: `recordings.view.${id}`
        },
        {
            icon: 'fal.calendar-week',
            id: 'recordings.viewGraphThisWeek',
            permission: `recordings.view.${id}`
        },
        {
            icon: 'fal.calendar',
            id: 'recordings.viewGraphThisMonth',
            permission: `recordings.view.${id}`
        },
        {
            icon: 'fal.wrench',
            id: 'recordings.manage',
            permission: `recordings.manage.${id}`
        }
    ];
    
    return (
        <div className="col-12">
            <div className={`tile btn btn-stretch active-btn-primary ${asSkeleton ? 'skeleton' : ''}`}>
                <div className="flex-row">
                    <Link
                            to={`/recordings/${id}/graph/`} 
                            className="link-hidden col px-0">
                        <div className="flex-row">
                            <Icon size="lg" className="tile__icon" name={icon || 'fal.question-circle'} color={color || 'red'} />
                                <h3 className="tile-title">
                                    {name}
                                </h3>
                        </div>
                        <div className="tile__content flex-row">
                            <span className="text-muted">Laatste meting: Vandaag om 08:00</span>
                        </div>
                    </Link>
                    <div className="col-auto mt-auto ms-auto">
                        <TileAction contextMenuItems={contextMenuItems} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Recording;