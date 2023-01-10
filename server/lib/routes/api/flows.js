const FlowController = require('@controllers/FlowController');
const FlowModel = require('@models/FlowModel');
const _ = require('lodash');

module.exports = app => {
    app.get('/api/flows', (req, res) => {
        return res.send(_.pickBy(FlowController.index(), (flow, flowId) => 
            new FlowModel(flowId).isValid));
    })

    app.get('/api/flows/:id', async (req, res) => {
        return res.send(new FlowModel(req.params.id));
    })
}

// const api = require('../../modules/api');
// const flows = require('../../modules/flows');
// const data = require('../../modules/data');
// const _ = require('lodash');

// module.exports = app => {
//     app.get('/api/flows/', (req, res) => {
//         const user = api.req.user.get(req);

//         let json = data.get('flows') || [];

//         json = json.filter(flow => user?.hasPermission(`flows.view.${flow.id}`));

//         return api.res.handle({ json, req, res, status: (user.id == '__GUEST__' ? 401 : 200) });
//     })

//     app.get('/api/flows/:id', (req, res) => {
//         if (!api.req.user.hasPermission(`flows.view.${req.params.id}`, req, res)) return;

//         try {
//             const flow = new flows.Flow(req.params.id, { parent: 'editor' });

//             if(flow.props == undefined)
//                 throw {error: 'Flow not found', status: 404};

//             flow.props.blocks = _.mapValues(flow.props.blocks, (props, id) => {
//                 return new flows.FlowBlock(id, { env: flow.env, flow: flow.props }, false).props;
//             });

//             return api.res.handle({ json: flow.props, req, res });
//         } catch (err) {
//             return api.res.handleError(err, res);
//         }
//     })

//     app.get('/api/flows/:id/presetoptions/:presetId', (req, res) => {
//         const user = api.req.user.get(req);

//         const filter = JSON.parse(decodeURIComponent(req.query.filter || 'null'));

//         // get options and reformat them
//         const json = _.mapValues(flows.getPresetOptions(req.params.presetId, filter), o => o.props == undefined ? o : [o.props.id, o.props.icon, o.props.name]);

//         return api.res.handle({ json, req, res, status: (user.id == '__GUEST__' ? 401 : 200) });
//     })
// }