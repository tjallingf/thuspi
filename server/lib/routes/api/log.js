// const LogController = require('@/controllers/LogController');

module.exports = app => {
    app.get('/api/log', async (req, res, next) => {
        // const max = Math.min(parseInt(req.query['max']) || 100, 200);
        // const fromDate = new Date((parseInt(req.query['fromdate']) * 1000) || Date.now());
        // const toDate = new Date(parseInt(req.query['todate'] * 1000));

        // let messages = await LogController.findForDate(fromDate, max);

        // // Filter messages until 'toDate'
        // if(isFinite(toDate)) 
        //     messages = messages.filter(m => m.time <= toDate.getTime());

        // return res.send(messages);
    })
}