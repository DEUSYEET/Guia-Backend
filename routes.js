module.exports = (app) => {
  const control = require("./controller");

  app.route("/test").get(control.test);
  app.route("/").get(control.test);
  app.route("/getAll").get(control.getAll);
  app.route("/getGuide").get(control.getGuide);
  app.route("/deleteGuide").get(control.deleteGuide);

  app.route("/voteGuide").post(control.voteGuide);
  app.route("/voteComment").post(control.voteComment);

  app.route("/uploadGuideHead").post(control.uploadGuideHead);
  app.route("/uploadGuideSection").post(control.uploadGuideSection);
  app.route("/uploadImage").post(control.uploadImage);
  app.route("/createUser").post(control.uploadUser);
  app.route("/uploadCommentBox").post(control.uploadCommentBox);
  app.route("/uploadComment").post(control.uploadComment);

  app.route("/getUser").post(control.getUser);
  app.route("/getCommentBox").post(control.getCommentBox);
  app.route("/getComments").post(control.getComments);
  app.route("/deleteComment").post(control.deleteComment);
};
