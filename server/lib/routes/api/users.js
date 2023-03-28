const UserController = require('@/controllers/UserController');
const _ = require('lodash');

const findRequestedUser = async (req, next) => {
    const requestUserId = req.params.id === 'me' ? req.user.id : req.params.id;
    const requestedUser = await UserController.find(requestUserId);
            
    if(!requestedUser) {
        next({status: 404, message: `Cannot find user with id '${requestUserId}'.`});
        return;
    }

    return requestedUser;
}

module.exports = app => {
    app.get('/api/users', async (req, res) => {
        const users = UserController.index();

        return res.json(_.mapValues(users, u => u.getSafeProps()));
    })

    app.get('/api/users/:id', async (req, res, next) => {
        const requestedUser = await findRequestedUser(req, next);
        if(!requestedUser) return;

        if(requestedUser.id != req.user.id && !req.user.hasPermission(`users.view.${requestedUser.id}`))
            return next({status: 401, message: `No permission to view userdata for ${requestedUser.toString()}.`});

        const json = requestedUser.getSafeProps();
        return res.json(json);
    })

    app.get('/api/users/:id/picture', async (req, res, next) => {
        const requestedUser = await findRequestedUser(req, next);
        if(!requestedUser) return;
        
        const filepath = requestedUser.getPicturePath();
        if(!filepath) return next({ status: 400, message: `${requestedUser.toString()} does not have a picture.`});

        return res.sendFile(filepath);
    })
}