import api from '@/utils/express/middleware/api';
import Flow from '@/zylax/flows/Flow';
import { Express } from 'express';

export default (app: Express) => {
    app.get('/api/flows', api(Flow, async (api, req) => {
        await api.withCollection(api.getCollection());
    }))

    app.get('/api/flows/:id', api(Flow, async (api, req) => {
        await api.withResource(api.getResource(req.params.id));
    }))
}