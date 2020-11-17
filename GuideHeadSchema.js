let mongoose = require('mongoose');
var GuideHeadSchema = new mongoose.Schema({
    guideID: String,
    author:String,
    title:String,
    description:String,
    image:String,
    video:String,
    scoreUp:Number,
    upUsers:[String],
    scoreDown:Number,
    downUsers:[String],
})

module.exports = mongoose.model('GuideHead', GuideHeadSchema);