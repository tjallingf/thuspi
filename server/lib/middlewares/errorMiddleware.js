const errorMiddleware = (err, req, res, next) => {
    if(typeof err == 'string') {
        console.error(err);
        return res.status(400).send({ error: err });
    }

    console.error(err.constructor.name == 'Object' ? err.message : err);
    return res.status(err.status || 500).send({error: err.message});
}

module.exports = errorMiddleware;