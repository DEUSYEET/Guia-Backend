let mongoose = require('mongoose');
var GuideSection = new mongoose.Schema({
    guideID: String, 
    sectionID: String, 
    title:String,
    description:String,
    image:String,
    video:String,
})

module.exports = mongoose.model('GuideSection', GuideSection);