const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    user: {
        type: String
    },

    message : {
        type: String
    },

    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    },

    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Chat', ChatSchema);
module.exports = mongoose.model('Chat', ChatSchema);