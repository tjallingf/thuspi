import _ from 'lodash';

const queryToArr = value => {
    if(_.isArray(value)) return value;
    if(!_.isString(value)) return [];
    return value.split(',');
}

const apiMiddleware = (req, res, next) => {
    res.selectors = {
        hide: queryToArr(req.query['hide']),
        show: queryToArr(req.query['show']),
        dynamic: queryToArr(req.query['dynamic']),
        filter: queryToArr(req.query['filter']),
        skip: parseInt(req.query['skip']),
        top: parseInt(req.query['top']) || -1
    }
    const { dynamic, show, hide, filter, top, skip } = res.selectors;

    res.sendCollection = async coll => {       
        // // Optionally fetch dynamic properties
        // if(dynamic.length) {
        //     coll = await Promise.all(_.map(coll, async m => {
        //         const dynamicProps = await m.getDynamicProps(dynamic);
        //         return _.defaults(m.getProps(), dynamicProps);
        //     }))
        // } else {
        //     coll = _.map(coll, m => m.getProps());
        // }
        let json = await Promise.all(_.map(coll, m => m.getAllProps()));

        if(show.length) json = _.filter(json, m => show.includes(m.id.toString()));
        if(hide.length) json = _.filter(json, m => !hide.includes(m.id.toString()));

        if(filter.length) json = _.map(json, m => _.pick(m, ['id', ...filter]));

        if(skip > 0) json = _.slice(json, skip);
        if(top >= 0) json = _.slice(json, 0, top);

        return res.json(json);
    }

    res.sendModel = async (model) => {
        let json = await model.getAllProps();

        // // Optionally fetch dynamic properties
        // if(dynamic.length) {
        //     const dynamicProps = await model.getDynamicProps(dynamic);
        //     props = _.defaults(props, dynamicProps);
        // }

        if(filter.length) json = _.pick(json, filter);

        return res.json(json);
    }

    next();
}

export default apiMiddleware;