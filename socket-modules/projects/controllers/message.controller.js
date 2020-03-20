module.exports = (io, socket, data) => {
    const eventName = 'message';

    io.to(data.room).emit(eventName, data);
}

