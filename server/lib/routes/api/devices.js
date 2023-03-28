const DeviceController = require('@/controllers/DeviceController');
const _ = require('lodash');
const NoPermissionError = require('@/errors/NoPermissionError');
const NotFoundError = require('@/errors/NotFoundError');

module.exports = app => {
    app.get('/api/devices', async (req, res) => {
        res.sendCollection(_.filter(
            await DeviceController.index(), 
            d => req.user.hasPermission(`devices.read.${d.id}`)
        ));
    })

    // For getting information about a device
    app.get('/api/devices/:id', async (req, res) => {
        if(!req.user.hasPermission(`devices.read.${req.params['id']}`))
            throw new NoPermissionError();

        const device = await DeviceController.find(req.params['id']);
        if(!device) throw new NotFoundError();
            
        return res.sendModel(device);
    })

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

    // When the value of a device's input changes
    app.patch('/api/devices/:id/inputs', async (req, res, next) => {
        if(!req.user.hasPermission(`devices.read.${req.params['id']}`))
            throw new NoPermissionError();

        const device = await DeviceController.find(req.params['id']);
        if(!device) throw new NotFoundError();

        Promise.all(_.map(req.body.inputs, ({ name, value }) =>
            device.handleInput(name, value)
        ))
        .then(() => {
            res.sendModel(device);
        })
        .catch(err => {
            next(err);
        })
    })

    // For calling the search handler of a device
    app.get('/api/devices/:id/search', async (req, res, next) => {
        if(!req.user.hasPermission(`devices.read.${req.params['id']}`))
            throw new NoPermissionError();

        const device = await DeviceController.find(req.params['id']);
        if(!device) throw new NotFoundError();

        const { results } = await device.handleSearch(req.query['keyword'] || '');

        return res.json({
            results
        });
    })
    
    // For getting the device's state
    app.get('/api/devices/:id/state', async (req, res, next) => {
        if(!req.user.hasPermission(`devices.read.${req.params['id']}`))
            throw new NoPermissionError();

        const device = await DeviceController.find(req.params['id']);
        if(!device) throw new NotFoundError();

        return res.json(await device.fetchState());
    })
}