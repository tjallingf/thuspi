const RoomController = require('@/controllers/RoomController');
const _ = require('lodash');

module.exports = app => {
    // RoomController.index()
    app.get('/api/rooms', async (req, res) => {
        let rooms = await RoomController.index();

        // Only include rooms that the user is allowed to read
        rooms = _.pickBy(rooms, d => req.user.hasPermission(`rooms.read.${d.id}`));

        return res.json(rooms);
    })
}