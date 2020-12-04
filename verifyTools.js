let mongoose = require("mongoose");
let Comment = mongoose.model("Comment");
let User = mongoose.model("User");
let GuideHead = mongoose.model("GuideHead");


const decodeToken = (token) => {
  let tokenSection = token.split(".")[1];
  let decodedSection = Buffer.from(tokenSection, "base64");
  let jsonToken = JSON.parse(decodedSection);
  return jsonToken;
};

const getUsernameFromEmail = async (email) =>
  await new Promise((resolve, reject) => {
    User.findOne({ email: email }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        // console.log(result.username);
        let username = result.username;
        resolve(username);
      }
    });
  });

exports.verifyCommentAuthor = async(token, commentID) => 
await new Promise((resolve,reject)=>{
    Comment.findOne({ commentID: commentID }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let author = result.author;
        let email = decodeToken(token).email;
        getUsernameFromEmail(email).then((user) => {
        //   console.log(email, author, user, author === user);
          resolve(author === user);
        });
      }
    });
  });

exports.verifyGuideAuthor = async(token, guideID) => 
await new Promise((resolve,reject)=>{
    GuideHead.findOne({ guideID: guideID }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let author = result.author;
        let email = decodeToken(token).email;
        getUsernameFromEmail(email).then((user) => {
        //   console.log(email, author, user, author === user);
          resolve(author === user);
        });
      }
    });
  });

// export { decodeToken, getUsernameFromEmail , verifyCommentAuthor};
