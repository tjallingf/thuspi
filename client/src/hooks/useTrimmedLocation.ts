import { useLocation, Location } from 'react-router';
import { trimEnd } from 'lodash';

function useTrimmedLocation(): Location {
    const location = useLocation();
    
    location.pathname = trimEnd(location.pathname, '/');

    return location;
}

export default useTrimmedLocation;