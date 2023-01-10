const UserController = require('@controllers/UserController');
const _ = require('lodash');

const getForUser = (req, next) => {
    const forUserId = req.params.id === 'me' ? req.user.id : req.params.id;
    const forUser = UserController.find(forUserId);
            
    if(!forUser)
        return next({status: 404, message: `Cannot find user with id '${forUserId}'.`});

    return forUser;
}

module.exports = app => {
    app.get('/api/users', async (req, res) => {
        const users = UserController.index();

        return res.json(_.mapValues(users, u => u.getSafeProps()));
    })

    app.get('/api/users/:id', (req, res, next) => {
        const forUser = getForUser(req, next);
        if(!forUser) return;

        if(forUser.id != req.user.id && !req.user.hasPermission(`users.view.${forUser.id}`))
            return next({status: 401, message: `No permission to view userdata for ${forUser.toString()}.`});

        const json = forUser.getSafeProps();
        return res.json(json);
    })

    app.get('/api/users/:id/picture', (req, res, next) => {
        const forUser = getForUser(req, next);
        const filepath = forUser.getPicturePath();
        if(!filepath) return next({ status: 400, message: `${forUser.toString()} does not have a picture.`});

        return res.sendFile(filepath);
    })
}