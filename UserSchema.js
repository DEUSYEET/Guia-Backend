let mongoose = require('mongoose');
var User = new mongoose.Schema({
    username: String, 
    email: String, 
    image: String, 
})

module.exports = mongoose.model('User', User);