import _ from 'lodash';
import { devices } from '../../zylax';
import { Device, DeviceController } from '@/zylax/devices';
import apiRoute from '@/server/apiRoute';
import { Server } from '@/server/types';
import { SerializedRecord } from '@/zylax/records/Record/Record';

export default (server: Server) => {
    server.get(
        '/api/devices',
        apiRoute(Device, async (route, req) => {
            await route.respondWithCollection(route.getCollection());
        }),
    );

    server.get(
        '/api/devices/:id',
        apiRoute(Device, async (route, req) => {
            await route.respondWithDocument(route.getDocument(req.params.id));
        }),
    );

    server.get(
        '/api/devices/:id/records',
        apiRoute(Device, async (route, req) => {
            const device = route.getDocument(req.params.id);
            const config = device.records.config.get();

            let records: SerializedRecord[] = await route.querySwitch(
                [{ top: 'number' }, ({ top }: { top: number }) => device.records.readTop(top)],
                [
                    { from: 'date', to: 'date' },
                    ({ from, to }: { from: Date; to: Date }) => device.records.readPeriod(from, to),
                ],
            );

            const filterFields = req.query['fields']?.split?.(',');
            const fieldNamesByAlias = Object.fromEntries(
                Object.entries(config.fields).map(([name, config]) => {
                    return [config.alias, name];
                }),
            );

            if (filterFields) {
                records = records.map((record) => {
                    return {
                        ...record,
                        v: _.pickBy(record.v, (value, fieldAlias) => {
                            const fieldName = fieldNamesByAlias[fieldAlias];
                            return filterFields.includes(fieldName);
                        }),
                    };
                });
            }

            route.setAggregation({
                config: config,
            });

            route.respondWith(records);
        }),
    );

    // // For updating the properties of a device
    // app.patch('/api/devices/:id', async (req, res, next) => {
    //     const device = await DeviceController.find(req.params['id']);
    //     if(!device) return res.status(404).send('Device not found.');

    //     // Pick properties that the user is allowed to update
    //     const newProps = _.pick(req.body, (() => {
    //         let pick = [];

    //         req.user.hasPermission(`devices.manage.${req.params['id']}`)
    //             pick.push('name', 'icon', 'driver');

    //         return pick;
    //     })());

    //     // Update properties of device
    //     device.setProps(newProps);

    //     return res.json(device.getProps());
    // })

    // Set the value of an input of a device
    server.patch(
        '/api/devices/:id/inputs',
        apiRoute(Device, async (route, req) => {
            const device = route.getDocument(req.params.id);

            await Promise.all(_.map(req.body.inputs, ({ name, value }) => device.handleInput(name, value))).then(
                async () => route.respondWithDocument(device),
            );
        }),
    );

    // // // For calling the search handler of a device
    // // app.get('/api/devices/:id/search', async (req, res, next) => {
    // //     // @ts-ignore
    // //     if(!req.user.hasPermission(`devices.read.${req.params['id']}`))
    // //         throw new PermissionError();

    // //     const device = await DeviceController.find(req.params['id']);
    // //     if(!device) throw new NotFoundError();

    // //     const { results } = await device.handleSearch(req.query['keyword'] || '');

    // //     return res.json({
    // //         results
    // //     });
    // // })

    // // Get the state of a devices
    // app.get('/api/devices/:id/state',
    //     api({ permission: 'devices.{id}.view' }),
    //     async (req, res, next) => {
    //     if(!req.user.hasPermission(`devices.read.${req.params['id']}`))
    //         throw new PermissionError();

    //     const device = await devices.DeviceController.find(req.params['id']);
    //     if(!device) throw new NotFoundError();

    //     return res.json(await device.fetchState());
    // })

    // // Get the recordings of a device
    // app.get('/api/devices/:id/state', async (req, res, next) => {

    // })
};
