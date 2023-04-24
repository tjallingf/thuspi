import ApiError, { ApiErrorJSON } from '@/errors/api/ApiError';
import { logger } from '@/zylax/lib/Logger';

const apiLogger = logger.child({ label: 'API' });

export default (err, req, res, next) => {
    let data: ApiErrorJSON;

    if(err instanceof ApiError) {
        data = err.toJSON();
    } else if(err instanceof Error) {
        data = {
            type: 'ServerError',
            message: err.message,
            status: 500
        }
        console.error(err);
    } else {
        data = {
            type: 'UnknownError',
            message: 'An unknown error occured.',
            status: 500
        }
    }

    res.status(data.status).json(data);
}