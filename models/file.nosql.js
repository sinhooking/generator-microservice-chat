const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    originName: {
        type: String
    },

    name: {
        type: String
    },

    fileBuffer: {
        type: Buffer
    },

    videoChunk: {
        type: mongoose.Schema.Types.ObjectId,
    },

    size: {
        type: Number
    },

    encoding: {
        type: String
    },

    mimeType: {
        type: String
    },

    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('File', FileSchema);
module.exports = mongoose.model('File', FileSchema);