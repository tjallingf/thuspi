import _ from 'lodash';
import { devices } from '../../zylax';
import api from '../../utils/express/middleware/api';
import { Device, DeviceController } from '@/zylax/devices';
import dayjs from 'dayjs';

export default (app) => {
    app.get('/api/devices', api(Device, async (api, req) => {
        await api.withCollection(api.getCollection());
    }))

    app.get('/api/devices/:id', api(Device, async (api, req) => {
        await api.withResource(api.getResource(req.params.id));
    }))

    app.get('/api/devices/:id/records', api(Device, async (api, req) => {
        const device = api.getResource(req.params.id);

        await api.querySwitch(
            [{ top: 'number' }, async ({ top }: { top: number }) => {
                api.withResult(await device.records.readTop(top));
            }],
            [{ from: 'date', to: 'date' }, async ({ from, to }: { from: Date, to: Date }) => {
                api.withResult(await device.records.readPeriod(from, to));
            }]
        )

        api.withAggregation({
            config: device.records.config.get()
        });
    }))

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
    app.patch('/api/devices/:id/inputs', api(Device, async (res, req) => {
        const device = res.getResource(req.params.id);

        Promise.all(_.map(req.body.inputs, 
            ({ name, value }) => device.handleInput(name, value)))
        .then(async () => res.withResource(device))
    }))

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
}