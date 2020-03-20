module.exports = (io, socket, data) => {
    const eventName = 'upload';

    io.to(data.room).emit(eventName, data);
}
