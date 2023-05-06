const http = require('http');
const { Server } = require('socket.io');

let io;
const setup = (app) => {
    const server = http.createServer(app);
    io = new Server(server);

    io.on('connection', socket => {
        LOGGER.debug(`New connection to websocket from address '${socket.handshake.address}'.`);
    })

    return server;
}

const get = () => io; 

module.exports = { setup, get };