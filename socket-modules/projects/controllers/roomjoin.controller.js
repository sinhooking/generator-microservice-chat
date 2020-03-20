const findRoom = require('../middlewares').findRoom;
const mongoose = require('mongoose');
const Room = mongoose.model('ChatRoomList');
const path = require('path');
const config = require(path.resolve('config/env/development.nosql.env.js'))

module.exports = (io, socket, roomAndUser) => {
    findRoom(roomAndUser)
        .then(createOrFindRoom)
        .catch(err => console.log(err));

    socket.customUser = roomAndUser.user;
    socket.customRoom = roomAndUser.room;

    //join loom
    socket.join(roomAndUser.room);

    //emit join msg except for connected user
    socket.broadcast.to(roomAndUser.room).emit('msg', {
        notice: true,
        user: roomAndUser.user,
        message: `${roomAndUser.user} join "${roomAndUser.room}"`
    });

    function createOrFindRoom(room) {
        if (!room) {
            return Room.create({ roomName: roomAndUser.room })
        }

        return Room.findById(room._id)
            .populate({
                path: 'chats',
                options: {limit : 5, sort: { created: -1 }},
                populate: {
                    path: 'file'
                }
            })
            .exec((err, list) => {
                if (err) console.log(err);
                //get list for connected user
                io.to(socket.id).emit('pastChats', {
                    pastChats: list.chats
                });
            })
    }
}

