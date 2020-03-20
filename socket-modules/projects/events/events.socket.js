module.exports = (io, socket) => {
    
    const roomJoin = require('../controllers/roomjoin.controller');
    socket.on('roomJoin', data => roomJoin(io, socket, data));

    //msg event
    const message = require('../controllers/message.controller');
    socket.on('msg', data => message(io, socket, data));
    
    //upload event
    const upload = require('../controllers/upload.controller');
    socket.on('upload', data => upload(io, socket, data));
    
    socket.on('disconnect', (disconnectState) => {
        io.to(socket.room).emit('msg', {
            notice: true,
            user: socket.user,
            message: `${socket.user} disconnected "${socket.room}"`
        });
    });
}

