import { useEffect } from 'react';

const useOutsideListener = (ref, callback) => {
    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target))
                callback(e);
        }

        document.addEventListener('click', handleClick);

        return () => document.removeEventListener('click', handleClick);
    }, [ref]);
}

export default useOutsideListener;