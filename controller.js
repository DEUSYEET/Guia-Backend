const aws = require('aws-sdk');
let mongoose = require('mongoose');
let uuid = require('uuid')
let GuideHead = mongoose.model('GuideHead')
let GuideSection = mongoose.model('GuideSection')
const awsID = "AKIAUYKTZAP5S2CBDXPV";
const awsSecret = "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";
const imageBucket = 'guia-images';

const s3 = new aws.S3({
    accessKeyId:awsID,
    secretAccessKey:awsSecret
});

exports.test = (req, res) => {
    res.json("Hello There");
}



exports.getAll = (req,res)=>{
    GuideHead.find((err,result)=>{
        if(err){
            res.json(err)
        }
        res.send(result);
    })
}

exports.getGuide = (req,res)=>{
    let guideId = req.query.guideId;
    let guideSections = [];

    GuideHead.findOne({"guideID":guideId}, (err,result)=>{
        if(err){
            res.json(err)
        }
        guideSections.push(result)
        GuideSection.find({"guideID":guideId}, (err,result)=>{
            if(err){
                res.json(err)
            }
            guideSections.push(result);
            res.send(guideSections);
        })
    })


}



exports.uploadGuideHead = (req,res) =>{
    let headData = JSON.parse(req.body.file);

    let title = headData.title;
    let description = headData.description;
    let image =  headData.image;
    let video = headData.video;
    let author = headData.author;

    let id = headData.id || uuid.v4();


    let head = new GuideHead();
    head.title = title;
    head.description = description;
    head.image = image;
    head.video = video;
    head.guideID = id;
    head.author = author || "Anonymous";
    head.scoreUp = 0;
    head.scoreDown = 0;

    // console.log(head);

    head.save((err,result)=>{
        if (err){
            res.json(err);
        } else {
            res.json(result);
        }
    })

}


exports.uploadGuideSection = (req,res) =>{
    let title = req.body.title;
    let description = req.body.desc;
    let image =  req.body.image;
    let video = req.body.video;
    let guideID = req.body.guideID;


    let section = new GuideSection();
    section.title = title;
    section.description = description;
    section.image = image;
    section.video = video;
    section.guideID = guideID;

    console.log(section);
    section.save((err,result)=>{
        if (err){
            res.json(err);
        } else {
            res.json(result);
        }
    })

}


exports.uploadImage = (req,res)=>{
    // console.log(req.file);

    let params = {
        Bucket:imageBucket,
        Key:req.file.originalname,
        Body:req.file.buffer
    }

    s3.upload(params, (err,data)=>{
        if(err){
            console.log(err)
        }
        console.log(data);
        res.json(data);
    })

}