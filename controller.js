let mongoose = require('mongoose');
let GuideHead = mongoose.model('GuideHead')
let uuid = require('uuid')


exports.test = (req, res) => {
    res.json("Hello There");
}


exports.uploadGuide = (req,res) =>{
    let title = req.body.title;
    let description = req.body.desc;
    let image =  req.body.image;
    let video = req.body.video;
    let author = req.body.author;

    let id = uuid.v4();


    let head = new GuideHead();
    head.title = title;
    head.description = description;
    head.image = image;
    head.video = video;
    head.guideID = id;
    head.author = author;
    head.scoreUp = 0;
    head.scoreDown = 0;


    console.log(head);

    head.save((err,result)=>{
        if (err){
            res.json(err);
        } else {
            res.json(result);
        }
    })

}

exports.getAll = (req,res)=>{
    GuideHead.find((err,result)=>{
        if(err){
            res.json(err)
        }
        res.send(result);
    })
}