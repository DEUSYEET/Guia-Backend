let mongoose = require('mongoose');
var GuideHeadSchema = new mongoose.Schema({
    guideID: String,
    title:String,
    description:String,
    image:String,
    video:String
})

module.exports = mongoose.model('GuideHead', GuideHeadSchema);