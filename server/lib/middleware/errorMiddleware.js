const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    if(typeof err == 'string')
        return res.status(500).json({ error: err });

    if(typeof err.length != 'undefined')
        return res.status(err[1] || 500).json({ error: err[0]?.message || err });

    return res.status(err?.httpStatus || 500).json({ error: err?.message || err });
}

module.exports = errorMiddleware;