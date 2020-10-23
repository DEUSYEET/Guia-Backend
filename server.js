const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
let mongoose = require('mongoose');
const routes = require("./routes");


let GuideHeadSchema = require('./GuideHeadSchema')

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://root:GRHSNOuDazb37S4j@guia0.evfpg.mongodb.net/guides?retryWrites=true&w=majority").catch(error => console.log("error"));
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));

mdb.once('open', function (callback) {
    console.log(mdb.name);
});




app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


// app.use(cors({
//     origin: "http://localhost:3000",
//     methods: ['GET', 'POST', 'DELETE']
// }))


routes(app);

app.listen(process.env.PORT || 8080);