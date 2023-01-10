const DeviceController = require('@controllers/DeviceController');
const _ = require('lodash');

module.exports = app => {
    // For getting a list of all devices
    app.get('/api/devices', (req, res) => {
        let devices = DeviceController.index();

        // Only include devices that the user is allowed to read
        devices = _.pickBy(devices, d => req.user.hasPermission(`devices.view.${d.id}`));

        return res.json(_.mapValues(devices, d => d.getProps()));
    })

    // For getting information about a device
    app.get('/api/devices/:id', async (req, res) => {
        const device = DeviceController.find(req.params['id']);
        if(!device) return res.status(404).send('Device not found.');
            
        return res.json(device.getProps());
    })

    // For updating the properties of a device
    app.patch('/api/devices/:id', async (req, res, next) => {
        const device = DeviceController.find(req.params['id']);
        if(!device) return res.status(404).send('Device not found.');

        // Pick properties that the user is allowed to update
        const newProps = _.pick(req.body, (() => {
            let pick = [];

            req.user.hasPermission(`devices.manage.${req.params['id']}`)
                pick.push('name', 'icon', 'driver');

            return pick;
        })());

        // Update properties of device
        device.setProps(newProps);

        return res.json(device.getProps());
    })

    // When the value of a device's input changes
    app.patch('/api/devices/:id/input', async(req, res, next) => {
        if(!req.user.hasPermission(`devices.write.${req.params['id']}`))
            return next('No permission.');

        const device = DeviceController.find(req.params['id']);
        if(!device) return res.status(404).send('Device not found.');

        const { name, value } = req.body;

        try {
            await device.handleInput(name, value);
            const data = {
                device: device.getProps(),
                driverManifest: device.driverManifest.isTruthy('writing.dynamicInputs')
                     ? device.readDriverManifest().get()
                     : device.driverManifest.get()
            }

            res.json(data);
        } catch(err) {
            console.error(err);
            next(err);
        }
    })

    // For calling the search handler of a device
    app.get('/api/devices/:id/search', async (req, res, next) => {
        if(!req.user.hasPermission(`devices.write.${req.params['id']}`))
            return next('No permission.');
        
        const device = DeviceController.find(req.params['id']);
        if(!device) return res.status(404).send('Device not found.');

        const { results } = await device.handleSearch(req.query['keyword'] || '');

        return res.json({
            results
        });
    })
    
    app.get('/api/devices/:id/driver-manifest', (req, res, next) => {
        const device = DeviceController.find(req.params['id']);
        if(!device)
            return res.status(404).send('Device not found.');

        return res.send(device.readDriverManifest().get());
    })

    app.get('/api/devices/:id/recordings', async (req, res) => {
        if (!api.req.user.hasPermission(`recordings.view.${req.params['id']}`, req, res)) return;

        const { from, until, limit, filetype } = req.query;

        // send recordings as a csv file
        try {
            const device = new devices.Device(req.params['id']);

            const data = await device.getRecordings(filetype, from, until, limit);

            if(filetype == 'csv')
                return res.status(200).send(data);

            return api.res.handle({ json: data, req, res });
        } catch (err) {
            console.error(err);
            next({err});
        }
    })
}