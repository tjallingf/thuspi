const passport = require('passport');
const UserController = require('@/controllers/UserController');

module.exports = app => {
    app.post('/api/auth/login/', passport.authenticate('local'), (req, res) => {
        return res.send({ user: req.user.getSafeProps() });
    });

    app.post('/api/auth/error', (req,) => {
        return res.send('oeps!');
    })

    app.get('/api/auth/logout/', (req, res) => {
        req.logout(async err => {
            if (err) { return next(err); }
            return res.send({ user: (await UserController.find('default')).getSafeProps() });
        });
    })
}