export default (app) => {
    app.get('/', (req, res) => {
        res.render('index', {
            developmentEnv: process.env.NODE_ENV === 'development'
        })
    })
}