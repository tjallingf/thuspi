import useTranslate from './useTranslate';
import { padStart } from 'lodash';

const useDate = (dt, { time = 'exact', date = 'exact' }) => {
    const key = `generic.timeFormat.${date}.${time}`;

    return useTranslate(key, [
        padStart(dt.getDate(), 2, '0'),          // %0: Padded number of day of month
        padStart(dt.getMonth() + 1, 2, '0'),     // %1: Padded number of month of year
        dt.getFullYear(),                        // %2: Number of year
        padStart(dt.getHours(), 2, '0'),         // %3: Padded hour of day
        padStart(dt.getMinutes(), 2, '0'),       // %4: Padded minute of hour
        padStart(dt.getSeconds(), 2, '0')        // %5: Padded second of minute
    ]);
}

export default useDate;