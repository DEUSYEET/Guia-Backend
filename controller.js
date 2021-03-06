const aws = require("aws-sdk");
let mongoose = require("mongoose");
let uuid = require("uuid");
let GuideHead = mongoose.model("GuideHead");
let GuideSection = mongoose.model("GuideSection");
let User = mongoose.model("User");
let CommentBox = mongoose.model("CommentBox");
let Comment = mongoose.model("Comment");
let ChatLog = mongoose.model("ChatLog");
const credentials = require("./credentials");
const { verifyCommentAuthor, verifyGuideAuthor } = require("./verifyTools");

let awsID = credentials.getID();
let awsSecret = credentials.getSecret();
const imageBucket = "guia-images";

const s3 = new aws.S3({
  accessKeyId: awsID,
  secretAccessKey: awsSecret,
});

exports.test = (req, res) => {
  res.json("Hello There");
};

exports.getAll = (req, res) => {
  GuideHead.find((err, result) => {
    if (err) {
      res.json(err);
    }
    res.send(result);
  });
};

exports.getGuide = (req, res) => {
  let guideId = req.query.guideId;
  let guideSections = [];

  GuideHead.findOne({ guideID: guideId }, (err, result) => {
    if (err) {
      res.json(err);
    }
    guideSections.push(result);
    GuideSection.find({ guideID: guideId }, (err, result) => {
      if (err) {
        res.json(err);
      }
      guideSections.push(result);
      res.send(guideSections);
    });
  });
};

exports.deleteGuide = (req, res) => {
  let guideId = req.query.guideId;
  let token = req.query.token;

  verifyGuideAuthor(token, guideId).then((val) => {
    if (val) {
      GuideHead.deleteOne({ guideID: guideId }, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          GuideSection.deleteMany({ guideID: guideId }, (err, result) => {
            if (err) {
              res.json(err);
            } else {
              res.json(result);
            }
          });
        }
      });
    }
  });
};

exports.deleteGuideSection = (req, res) => {
  let sectionData = JSON.parse(req.body.file);
  // console.log(sectionData)
  verifyGuideAuthor(sectionData.token, sectionData.guideID).then((val) => {
    if (val) {
      // console.log(val);
      GuideSection.findByIdAndDelete(sectionData.sectionID, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      });
    }
  });
};

exports.uploadGuideHead = (req, res) => {
  let headData = JSON.parse(req.body.file);
  let id = headData.guideID;
  let head = {
    guideID: id,
    title: headData.title,
    description: headData.description,
    image: headData.image,
    video: headData.video,
    author: headData.author || "Anonymous",
    scoreUp: headData.scoreUp || 0,
    scoreDown: headData.scoreDown || 0,
  };

  GuideHead.findOneAndUpdate(
    { guideID: id },
    head,
    { new: true, upsert: true },
    (err, result) => {
      if (err) {
        res.json(err);
        console.log(err);
      } else {
        res.json(result);
      }
    }
  );
};

exports.uploadGuideSection = (req, res) => {
  let headData = JSON.parse(req.body.file);
  let id = headData.sectionID;
  let section = {
    sectionID: id,
    guideID: headData.guideID,
    title: headData.title,
    description: headData.description,
    image: headData.image,
    video: headData.video,
  };

  GuideSection.findOneAndUpdate(
    { sectionID: id },
    section,
    { new: true, upsert: true },
    (err, result) => {
      if (err) {
        res.json(err);
        console.log(err);
      } else {
        res.json(result);
      }
    }
  );
};

exports.uploadImage = (req, res) => {
  // console.log(req.file);

  let params = {
    Bucket: imageBucket,
    Key: req.file.originalname,
    Body: req.file.buffer,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log(data);
    res.json(data);
  });
};

exports.uploadUser = (req, res) => {
  let userData = JSON.parse(req.body.file);
  let user = {
    username: userData.username,
    email: userData.email,
    image:
      userData.image ||
      "https://guia-images.s3-us-west-1.amazonaws.com/Full-Green-Tree-984x1024.png",
  };

  User.findOneAndUpdate(
    { email: user.email },
    user,
    { new: true, upsert: true },
    (err, result) => {
      if (err) {
        res.json(err);
        console.log(err);
      } else {
        res.json(result);
      }
    }
  );
};

exports.getUser = (req, res) => {
  let userData = JSON.parse(req.body.file);
  let user = {
    email: userData.email,
  };

  User.findOne({ email: user.email }, (err, result) => {
    if (err) {
      res.json(err);
      console.log(err);
    } else {
      res.json(result);
    }
  });
};

exports.getUsers = (req, res) => {
  User.find((err, result) => {
    if (err) {
      res.json(err);
      console.log(err);
    } else {
      res.json(result);
    }
  });
};

exports.getUserImage = (req, res) => {
  let userData = JSON.parse(req.body.file);
  let user = {
    username: userData,
  };
  // console.log(req.body.file);
  // console.log(user.username);
  User.findOne({ username: user.username }, (err, result) => {
    if (err) {
      res.json(err);
      console.log(err);
    } else {
      res.json(result);
    }
  });
};

exports.getUserFromName = (req, res) => {
  let userData = JSON.parse(req.body.file);
  let user = {
    username: userData.username,
  };

  User.findOne({ username: user.username }, (err, result) => {
    if (err) {
      res.json(err);
      console.log(err);
    } else {
      res.json(result);
    }
  });
};

exports.getUserImage = (req, res) => {
  let userData = JSON.parse(req.body.file);
  let user = {
    username: userData,
  };
  // console.log(req.body.file);
  // console.log(user.username);
  User.findOne({ username: user.username }, (err, result) => {
    if (err) {
      res.json(err);
      console.log(err);
    } else {
      res.json(result);
    }
  });
};

exports.voteGuide = (req, res) => {
  let voteData = JSON.parse(req.body.file);
  let guide = {
    guideID: voteData.guideID,
    voteType: voteData.voteType,
  };
  let user = voteData.user;

  GuideHead.findOne({ guideID: guide.guideID }, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      let newScoreDown = result.scoreDown || 0;
      let newScoreUp = result.scoreUp || 0;

      if (guide.voteType === "up" && !result.upUsers.includes(user)) {
        newScoreUp++;
        if (result.downUsers.includes(user)) {
          let index = result.downUsers.indexOf(user);
          result.downUsers.splice(index, 1, "");
          newScoreDown = result.scoreDown - 1;
        }
        result.upUsers.push(user);
      } else if (
        guide.voteType === "down" &&
        !result.downUsers.includes(user)
      ) {
        newScoreDown++;
        if (result.upUsers.includes(user)) {
          let index = result.upUsers.indexOf(user);
          result.upUsers.splice(index, 1, "");
          newScoreUp = result.scoreUp - 1;
        }
        result.downUsers.push(user);
      }

      // console.log(newScoreUp,newScoreDown)
      GuideHead.findByIdAndUpdate(
        result._id,
        {
          scoreUp: newScoreUp,
          scoreDown: newScoreDown,
          upUsers: result.upUsers,
          downUsers: result.downUsers,
        },
        {
          new: true,
        },
        (err, newResult) => {
          if (err) {
            // res.json(err);
          } else {
            res.json(newResult);
            console.log(newResult.scoreUp, newResult.scoreDown);
          }
        }
      );
    }
  });
};

exports.uploadCommentBox = (req, res) => {
  let boxData = JSON.parse(req.body.file);

  let box = {
    parentID: boxData.parentID,
    boxID: boxData.boxID,
  };

  CommentBox.findOneAndUpdate(
    { boxID: box.boxID },
    box,
    { new: true, upsert: true },
    (err, result) => {
      if (err) {
        res.json(err);
        console.log(err);
      } else {
        res.json(result);
      }
    }
  );
};

exports.getCommentBox = (req, res) => {
  let boxData = JSON.parse(req.body.file);
  let parentID = boxData.parentID;
  // console.log(parentID)

  CommentBox.findOne({ parentID: parentID }, (err, result) => {
    if (err) {
      res.json(err);
      console.log(err);
    } else {
      res.json(result);
    }
  });
};

exports.uploadComment = (req, res) => {
  let commentData = JSON.parse(req.body.file);

  let comment = {
    parentID: commentData.parentID,
    commentID: commentData.commentID,
    author: commentData.author,
    body: commentData.body,
    scoreUp: 0,
    upUsers: [],
    scoreDown: commentData.scoreDown,
    downUsers: [],
  };

  Comment.findOneAndUpdate(
    { commentID: comment.commentID },
    comment,
    { new: true, upsert: true },
    (err, result) => {
      if (err) {
        res.json(err);
        console.log(err);
      } else {
        res.json(result);
      }
    }
  );
};

exports.getComments = (req, res) => {
  let commentsData = JSON.parse(req.body.file);
  let parentID = commentsData.parentID;
  // console.log(parentID);

  Comment.find({ parentID: parentID }, (err, result) => {
    if (err) {
      res.json(err);
      console.log(err);
    } else {
      res.json(result);
    }
  });
};

exports.deleteComment = (req, res) => {
  let commentData = JSON.parse(req.body.file);
  verifyCommentAuthor(commentData.token, commentData.commentID).then((val) => {
    if (val) {
      let comment = {
        commentID: commentData.commentID,
        author: "[Deleted]",
        body: "[Deleted]",
      };

      Comment.findOneAndDelete(
        { commentID: comment.commentID },
        (err, result) => {
          if (err) {
            res.json(err);
            console.log(err);
          } else {
            res.json(result);
          }
        }
      );
    }
  });
};

exports.voteComment = (req, res) => {
  let voteData = JSON.parse(req.body.file);
  let comment = {
    commentID: voteData.commentID,
    voteType: voteData.voteType,
  };
  let user = voteData.user;

  // console.log(user, comment);
  Comment.findOne({ commentID: comment.commentID }, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      let newScoreDown = result.scoreDown || 0;
      let newScoreUp = result.scoreUp || 0;

      if (comment.voteType === "up" && !result.upUsers.includes(user)) {
        newScoreUp++;
        if (result.downUsers.includes(user)) {
          let index = result.downUsers.indexOf(user);
          result.downUsers.splice(index, 1, "");
          newScoreDown = result.scoreDown - 1;
        }
        result.upUsers.push(user);
      } else if (
        comment.voteType === "down" &&
        !result.downUsers.includes(user)
      ) {
        newScoreDown++;
        if (result.upUsers.includes(user)) {
          let index = result.upUsers.indexOf(user);
          result.upUsers.splice(index, 1, "");
          newScoreUp = result.scoreUp - 1;
        }
        result.downUsers.push(user);
      }

      // console.log(newScoreUp,newScoreDown)
      Comment.findByIdAndUpdate(
        result._id,
        {
          scoreUp: newScoreUp,
          scoreDown: newScoreDown,
          upUsers: result.upUsers,
          downUsers: result.downUsers,
        },
        {
          new: true,
        },
        (err, newResult) => {
          if (err) {
            // res.json(err);
          } else {
            res.json(newResult);
            // console.log(newResult.upUsers, newResult.downUsers);
          }
        }
      );
    }
  });
};

exports.uploadChatLog = (req, res) => {
  let logData = JSON.parse(req.body.file);

  let log = {
    roomID: logData.roomID,
    chatLog: logData.chatLog,
  };
  ChatLog.findOneAndUpdate(
    { roomID: log.roomID },
    log,
    { new: true, upsert: true },
    (err, result) => {
      if (err) {
        res.json(err);
        console.log(err);
      } else {
        res.json(result);
      }
    }
  );
};

exports.getChatLog = (req, res) => {
  let logData = JSON.parse(req.body.file);

  let log = {
    roomID: logData.roomID,
  };
  ChatLog.findOne({ roomID: log.roomID }, (err, result) => {
    if (err) {
      res.json(err);
      console.log(err);
    } else if(result){
      res.json(result);
    } else {
      ChatLog.findOneAndUpdate(
        { roomID: log.roomID },
        log,
        { new: true, upsert: true },
        (err, result) => {
          if (err) {
            res.json(err);
            console.log(err);
          } else {
            res.json(result);
          }
        }
      );
    }
  });
};
