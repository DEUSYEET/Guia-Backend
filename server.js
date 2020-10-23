const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const routes = require("./routes");


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


// app.use(cors({
//     origin: "http://localhost:3000",
//     methods: ['GET', 'POST', 'DELETE']
// }))


routes(app);

app.listen(process.env.PORT || 8080);