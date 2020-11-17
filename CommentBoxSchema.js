let mongoose = require('mongoose');
var CommentSchema = new mongoose.Schema({
    parentID: String,
    boxID: String,
    commentIDs: [String],
})

module.exports = mongoose.model('CommentBox', CommentSchema);