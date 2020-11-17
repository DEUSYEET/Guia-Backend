let mongoose = require('mongoose');
var CommentSchema = new mongoose.Schema({
    commentID: String,
    parentID: String,
    author:String,
    body:String,
    scoreUp:Number,
    upUsers:[String],
    scoreDown:Number,
    downUsers:[String],
})

module.exports = mongoose.model('Comment', CommentSchema);