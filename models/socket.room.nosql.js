const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
    roomName: {
        type: String
    },

    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }],

    created: {
        type: Date,
        default: Date.now
    }
});

ChatRoomSchema.methods.addMessageList = (chat) => {
    this.messageList.push(chat);
    return this.save();
};

mongoose.model('ChatRoomList', ChatRoomSchema);
module.exports = mongoose.model('ChatRoomList', ChatRoomSchema);