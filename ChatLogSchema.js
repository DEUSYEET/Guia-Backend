let mongoose = require('mongoose');
var ChatLog = new mongoose.Schema({
    roomID:String,
    chatLog:[{
        body:String,
        senderID:String,
        isCurrentUser:Boolean,
    }]
})

module.exports = mongoose.model('ChatLog', ChatLog);