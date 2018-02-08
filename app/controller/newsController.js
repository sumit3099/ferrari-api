const News = require('../imports/models/news');

exports.news = (req, res) => {
    News.find({}, (err, data) => {
        if (err) {
            res.send({
                err
            });
        }
        res.send({
            data: data
        });
    })
}
exports.newsDetails = (req, res) => {
    let newsId = req.query.newsId;
    let news = News.findOne({
        "_id": newsId
    }, (err, data) => {
        res.send({
            data: data
        })
    });
}

exports.addNews = (req, res) => {
    var today = new Date();
    let newNews = News({
        title: req.body.data.title,
        description: req.body.data.newsDescription,
        author: req.body.data.author,
        imageUrl: req.body.news,
        publishedAt: today
    });
    newNews.save((err, resp) => {
        if (err) {
            res.send({
                error: "Something wrong happened please try again later"
            })
        } else {
            res.send({
                data: " News Saved Successfully"
            });
        }
    })
}
exports.deleteNews = (req, res) => {
    News.deleteMany({ _id: { $in: req.body.data } }, (err, resp) => {
        if (err) {
            res.send({
                error: "Something wrong happened please try again later"
            })
        } else {
            res.send({
                data: "News Successfully Deleted !"
            });
        }
    })
}