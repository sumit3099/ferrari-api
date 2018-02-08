const Multimedia = require('../imports/models/multimedia');
const Products = require('../imports/models/products');
const multer = require('multer');
exports.vedioUpload = (req, res) => {
    Multimedia.findOne({}, {
        multimediaId: 1
    }, (err, resp) => {
        if (resp == null) {
            var id = 0;
        } else {
            id = resp.multimediaId + 1;
        }
        var today = new Date();
        let youtubeVideoId = youtube_parser(req.body.data.vedioLink);
        let vedio = Multimedia({
            title: req.body.data.title,
            description: req.body.data.vedioDescription,
            type: "video",
            category: req.body.data.category,
            level: req.body.data.level,
            url: "https://www.youtube.com/embed/" + youtubeVideoId,
            date: today,
            multimediaId: id,
            thumbnail: "https://img.youtube.com/vi/" + youtubeVideoId + "/0.jpg"
        });
        vedio.save((err, resp) => {
            if (err) {
                res.send({
                    error: "Something wrong happened please try again later"
                })
            } else {
                res.send({
                    data: " Video Upload Successfull"
                });
            }
        })
    }).sort({
        _id: -1
    }).limit(1);
}

exports.imageUpload = (req, res) => {

    Multimedia.findOne({}, {
        multimediaId: 1
    }, (err, resp) => {
        if (resp == null) {
            var id = 0;
        } else {
            id = resp.multimediaId + 1;
        }
        var today = new Date();
        let vedio = Multimedia({
            title: req.body.data.title,
            description: req.body.data.imageDescription,
            type: "image",
            category: req.body.data.category,
            level: req.body.data.level,
            url: req.body.image,
            date: today,
            multimediaId: id
        });
        vedio.save((err, resp) => {
            if (err) {
                res.send({
                    error: "Something wrong happened please try again later"
                })
            } else {
                res.send({
                    data: " image Upload Successfull"
                });
            }
        })
    }).sort({
        _id: -1
    }).limit(1);
}


/* Fetching video ID from youtube link : Starts Here */
function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

/*Posting comment to a mutilmedia*/
exports.postComment = (req, res) => {
    let today = new Date();
    Multimedia.findOne({
        "multimediaId": req.body.multimediaId
    }, (err, resp) => {
        let x = '{"userId":"' + req.body.userId + '", "userName":"' + req.body.userName + '","comment":"' + req.body.comment + '","date":"' + today + '"}';
        resp.comments.push(JSON.parse(x));
        resp.save((error, response) => {
            if (err) {
                res.send({
                    error: "Something wrong happened please try again later"
                })
            } else {
                res.send({
                    data: "Comment Added Succesfully !"
                });
            }
        })
    })
}


exports.deleteVideo = (req, res) => {
    Multimedia.deleteMany({ multimediaId: { $in: req.body.data } }, (err, resp) => {
        if (err) {
            res.send({
                error: "Something wrong happened please try again later"
            })
        } else {
            res.send({
                data: "Vedio Successfully Deleted !"
            });
        }
    })
}
exports.deleteImages = (req, res) => {
    Multimedia.deleteMany({ multimediaId: { $in: req.body.data } }, (err, resp) => {
        if (err) {
            res.send({
                error: "Something wrong happened please try again later"
            })
        } else {
            res.send({
                data: "Images Successfully Deleted !"
            });
        }
    })
}

exports.addProducts = (req, res) => {
    let productsDetail = Products({
        title: req.body.data.title,
        description: req.body.data.productDescription,
        category: req.body.data.category,
        thumbnail: req.body.product,
        price: req.body.data.price,
        size: req.body.size
    });
    productsDetail.save((err, resp) => {
        if (err) {
            res.send({
                error: "Something wrong happened please try again later"
            })
        } else {
            res.send({
                data: " Product Upload Successfull"
            });
        }
    })
}
exports.deleteProducts = (req, res) => {
    Products.deleteMany({ _id: { $in: req.body.data } }, (err, resp) => {
        if (err) {
            res.send({
                error: "Something wrong happened please try again later"
            })
        } else {
            res.send({
                data: "Product Successfully Deleted !"
            });
        }
    })
}