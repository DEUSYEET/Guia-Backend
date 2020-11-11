const aws = require("aws-sdk");
let mongoose = require("mongoose");
let uuid = require("uuid");
let GuideHead = mongoose.model("GuideHead");
let GuideSection = mongoose.model("GuideSection");
const credentials = require("./credentials");

//REMOVE AWS CREDENTIALS BEFORE COMMIT
//REMOVE AWS CREDENTIALS BEFORE COMMIT
//REMOVE AWS CREDENTIALS BEFORE COMMIT
//REMOVE AWS CREDENTIALS BEFORE COMMIT
//REMOVE AWS CREDENTIALS BEFORE COMMIT
//REMOVE AWS CREDENTIALS BEFORE COMMIT
//REMOVE AWS CREDENTIALS BEFORE COMMIT
//REMOVE AWS CREDENTIALS BEFORE COMMIT
//REMOVE AWS CREDENTIALS BEFORE COMMIT
//REMOVE AWS CREDENTIALS BEFORE COMMIT
//REMOVE AWS CREDENTIALS BEFORE COMMIT
//REMOVE AWS CREDENTIALS BEFORE COMMIT
//REMOVE AWS CREDENTIALS BEFORE COMMIT
//REMOVE AWS CREDENTIALS BEFORE COMMIT
//REMOVE AWS CREDENTIALS BEFORE COMMIT
//REMOVE AWS CREDENTIALS BEFORE COMMIT

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
