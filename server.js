const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
let mongoose = require("mongoose");
const routes = require("./routes");
const multer = require("multer");
const upload = multer();
var http = require("http").createServer(app);

//THIS THING IS STUPID UNSECURE Remember to remove undefined for production
// let whitelist = [
//   "http://guia.us-west-1.elasticbeanstalk.com",
//   "http://localhost:3000",
//   undefined,
// ];

let whitelist = [
  "http://guia.us-west-1.elasticbeanstalk.com",
  "http://localhost:3000",
];
const io = require("socket.io")(http, {
  cors: {
    methods: ["GET", "POST"],
    origin: (origin, callback) => {
      console.log(origin);
      if (whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin not allowed:    ${origin}`));
      }
    },
  },
});


app.use(
  cors({
    methods: ["GET", "POST", "DELETE"],
    origin: (origin, callback) => {
      // console.log(origin);
      if (whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin not allowed:    ${origin}`),true);
      }
    },
  })
);

let GuideHeadSchema = require("./GuideHeadSchema");
let GuideSectionSchema = require("./GuideSectionSchema");
let UserSchema = require("./UserSchema");
let CommentSchema = require("./CommentSchema");
let CommentBoxSchema = require("./CommentBoxSchema");
let ChatLogSchema = require("./ChatLogSchema");
const { createServer } = require("http");

mongoose.Promise = global.Promise;
mongoose
  .connect(
    "mongodb+srv://root:GRHSNOuDazb37S4j@guia0.evfpg.mongodb.net/guides?retryWrites=true&w=majority"
  )
  .catch((error) => console.log("error"));
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
var mdb = mongoose.connection;
mdb.on("error", console.error.bind(console, "connection error:"));

mdb.once("open", function (callback) {
  console.log(mdb.name);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.single("file"));

// let requestCount = 0;
// // const counter =
// app.use((req, res, next) => {
//   requestCount++;
//   console.log(requestCount);
//   next();
// });

routes(app);

io.on("connection", (socket) => {
  const { roomID } = socket.handshake.query;
  // console.log(socket.handshake.query)
  socket.join(roomID);

  socket.on("newChatMessage", (data) => {
    //   console.log("newMessage")
    io.in(roomID).emit("newChatMessage", data);
  });

  socket.on("disconnect", () => {
    socket.leave(roomID);
  });
});

http.listen(process.env.PORT || 8080);
