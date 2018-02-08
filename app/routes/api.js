const express = require('express');
const app = express();
var crypto = require('crypto');
var fs = require("fs");
const multer = require('multer');
const passport = require('passport');
const Users = require('../imports/models/users');
const UpcomingEvents = require('../imports/models/upcomingEvents');
const upRaces = require("../imports/models/upcomingRaces");
const Circuits = require('../imports/models/circuits');
const DriverStandings = require('../imports/models/driverStandings');
const TeamStandings = require('../imports/models/teamStandings');
const Teams = require('../imports/models/teams');
const Races = require('../imports/models/races');
const controller = require('../controller/controller');
const driverDetail = require('../controller/driverdetail')
const Drivers = require('../imports/models/drivers');
const Multimedia = require('../imports/models/multimedia');
const Products = require('../imports/models/products');
const booking = require('../controller/booking');
const forgetPassword = require('../controller/forgetPassword');
const multimediaUpload = require('../controller/multimediaUpload');
const newsController = require('../controller/newsController');
//var jwt = require("jwt-simple");
var jwt = require("jsonwebtoken");
var auth = require("./../../auth.js")();
var cfg = require("./../../config.js");

const cors = require("cors");

app.use(cors());

app.use((req,  res,  next) =>  {
    res.setHeader('Access-Control-Allow-Origin',  '*');
    res.setHeader('Access-Control-Allow-Headers',  'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods',  'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});


// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.get('/', (req, res) => {
    res.send('api works');
});
app.get('/posts', (req, res) => {
    contents = fs.readFileSync("app/files/news.json");
    var jsonContent = JSON.parse(contents);
    res.send(jsonContent);
});
app.get('/races', (req, res) => {
    contents = fs.readFileSync("app/files/races.json");
    var jsonContent = JSON.parse(contents);
    res.send(jsonContent);
});
app.post('/login', (req, res) => {
    let result = Users.findOne({
        "email": req.body.data.email,
        "password": req.body.data.pass,
    }, { password: 0 }, (err, resp) => {
        if (err) {
            res.send({
                data: ""
            });
        } else {

            if (resp == null)
                res.send({
                    data: ""

                })
            else {
                var token = jwt.sign({ data: resp }, 'MyS3cr3tK3Y', { expiresIn: 60480 });
                res.send({
                    data: resp,
                    token: `Bearer ${token}`
                })
            }
        }
    })
});


app.get('/leaderboard', (req, res) => {
    let result = Users.find({}, {
        '_id': false,
        name: true,
        'points': true,
        profilePicUrl: true,
        country: true,
        gender: true,
        dob: true,
        email: true
    }).sort({
        'points': -1
    }).limit(10);
    result.exec((err, resp) => {
        if (err) {
            res.send({
                error: ""
            });
        } else {
            res.send({
                data: resp
            })
        }
    })
});

app.get('/drivers', (req, res) => {
    let result = Drivers.find({}, {});
    result.exec((err, resp) => {
        if (err) {
            res.send({
                data: ""
            });
        }
        res.send({
            data: resp
        })
    })
});

app.get('/upcoming_races', (req, res) => {
    upRaces.find({}, (err, response) => {
        res.send(response);
    })
});

app.get('/upcoming-events', (req, res) => {
    UpcomingEvents.find({}, (err, data) => {
        res.send({
            data: data
        });
    })
});

/* API call for a particular event */
app.get('/upcoming-events/event', (req, res) => {
    let eventId = req.query.eventId;
    let statement = UpcomingEvents.findOne({
            "_id": eventId
        },
        (err, data) => {
            res.send({
                data: data
            })
        });
});



app.get('/circuits', (req, res) => {
    Circuits.find({}, (err, data) => {
        res.send({
            data: data
        });
    })
});

app.get('/driver-standings', (req, res) => {
    DriverStandings.find({}, (err, data) => {
        res.send({
            data: data
        });
    })
});

app.get('/team-standings', (req, res) => {
    TeamStandings.find({}, (err, data) => {
        res.send({
            data: data
        });
    })
});

app.get('/drivers', (req, res) => {
    Drivers.find({}, (err, data) => {
        res.send({
            data: data
        })
    })
})


app.get('/circuits/circuit-details', (req, res) => {
    let jsonResult = {};
    let circuitId = req.query.circuitId;
    Circuits.findOne({
        "circuitId": circuitId
    }, {
        "_id": 0
    }, (err, data_circuit) => {
        jsonResult.circuit = data_circuit;

        Races.find({
            "circuitId": circuitId
        }, {
            "_id": 0,
            "season": 1,
            "circuitId": 1,
            "date": 1,
            "result": {
                $slice: 3
            }
        }, (err, data_races) => {
            jsonResult.result = data_races;
            res.send({
                data: jsonResult
            })
        }).sort({
            "season": 1
        })
    });
});

/* API call for multimedia page */
app.get('/multimedia-images', (req, res) => {
    Multimedia.find({
        "type": "image"
    }, {
        "_id": 0,
        "comments": 0
    }, (err, data) => {
        res.send({
            data: data
        })
    })
});

app.get('/multimedia-images/image', (req, res) => {
    let multimediaId = req.query.multimediaId;
    let statement = Multimedia.findOne({
        "multimediaId": multimediaId,
        "type": "image"
    }, {
        "_id": 0
    }, (err, data) => {
        res.send({
            data: data
        })
    });
});

app.get('/multimedia-videos', (req, res) => {
    Multimedia.find({
        "type": "video"
    }, {
        "_id": 0,
        "comments": 0
    }, (err, data) => {
        res.send({
            data: data
        })
    })
});

app.get('/multimedia-videos/video', (req, res) => {
    let multimediaId = req.query.multimediaId;
    let statement = Multimedia.findOne({
        "multimediaId": multimediaId,
        "type": "video"
    }, {
        "_id": 0
    }, (err, data) => {
        res.send({
            data: data
        })
    });
});

app.get('/multimedia', (req, res) => {
    Multimedia.find({}, {
        "_id": 0,
        "comments": 0
    }, (err, data) => {
        res.send({
            data: data
        })
    })
});

app.get('/teams', (req, res) => {
    Teams.find({}, (err, response) => {
        if (err) {
            res.send({
                data: ""
            });
        }
        res.send({
            data: response
        });
    })
});

/* API for product section starts from here here */
app.get('/products', (req, res) => {
    Products.find({}, (err, data) => {
        res.send({
            data: data
        })
    })
})


//app.use(auth.initialize());

app.post("/token", function(req, res) {
    if (req.body.data.email && req.body.data.pass) {
        var email = req.body.data.email;
        var password = req.body.data.pass;
        var user = Users.findOne({
            "email": email,
            "password": password,
        }, (err, resp) => {
            if (resp) {
                var payload = {
                    id: resp.email
                };
                //   console.log(payload);
                var token = jwt.sign({ data: resp }, 'MyS3cr3tK3Y', { expiresIn: 60480 });
                //  console.log(token);
                res.json({
                    token: `Bearer ${token}`
                });
            } else {
                res.sendStatus(401);
            }
        });
    }
    // if (req.body.email != null) {
    //     var token = jwt.sign({ data: req.body.email }, 'MyS3cr3tK3Y', { expiresIn: 60480 });
    //     res.json({
    //         token: `Bearer ${token}`
    //     });
    else {
        res.sendStatus(401);
    }
});

//console.log(auth.authenticate());
// app.use((req, res, next) => {
//     console.log("hii");
//     //console.log(next);
//     if (auth.authenticate()) {
//         console.log("authenticated");
//         next();
//     }
//     console.log("not authenticated")

// });
// app.use(() => {
//     if (auth.authenticate()) {
//         next;
//     }
// })
app.get("/user", passport.authenticate('jwt', { session: false }), function(req, res) {
    // console.log(req.headers);
    console.log('xyz');
    res.send({ data: "xyzsafd" });
});
app.get('/teams/:teamId', controller.teamDetail);
app.get('/driver_detail/:driver', driverDetail.driverDetail);
app.get('/driverStangingDetail/:driver', driverDetail.driverStangingDetail);
app.get('/driverPersonalDetail/:driver', driverDetail.driverPersonalDetail);
app.post('/adal', controller.adalUser);
app.post('/signup', controller.signup);
app.post('/eventBooking', booking.booking);
app.post('/ticketBooking', booking.raceBooking);
app.post('/bookings', passport.authenticate('jwt', { session: false }), booking.bookings);
app.post('/myorders', passport.authenticate('jwt', { session: false }), booking.orders);
app.post('/stadiumCollaborator', passport.authenticate('jwt', { session: false }), controller.stadiumCollaborator);
app.post('/sendKey', forgetPassword.sendKey);
app.post('/setPassword', forgetPassword.setPassword);
app.get('/news', newsController.news);
app.get('/news/details', newsController.newsDetails);
app.use('/driver', express.static(__dirname + '/../../assets/driver'));
app.use('/driver', express.static(__dirname + '/../../assets/driver'));
app.get('/seasons', controller.racesResult);
app.get('/seasons/season-details/:season', controller.seasonResult);
app.post('/updatePoints', controller.updatePoints)
app.post('/purchaseMerchandise', controller.purchaseMerchandise);
/* API call for image & videos*/
app.use('/multimedia/images', express.static(__dirname + '/../../assets/multimedia/images'));
app.use('/multimedia/videos', express.static(__dirname + '/../../assets/multimedia/videos'));
app.use('/product/thumbnail', express.static(__dirname + '/../../assets/products'));
app.use('/logos', express.static(__dirname + '/../../assets/logos'));
app.use('/event/thumbnail', express.static(__dirname + '/../../assets/birthday'));
app.post('/vedioUpload', passport.authenticate('jwt', { session: false }), multimediaUpload.vedioUpload)
app.post('/imageUpload', passport.authenticate('jwt', { session: false }), multimediaUpload.imageUpload)
app.post('/postComment', multimediaUpload.postComment);
app.post('/vedioDelete', passport.authenticate('jwt', { session: false }), multimediaUpload.deleteVideo);
app.post('/imagesDelete', passport.authenticate('jwt', { session: false }), multimediaUpload.deleteImages);
app.post('/productUpload', passport.authenticate('jwt', { session: false }), multimediaUpload.addProducts);
app.post('/productDelete', passport.authenticate('jwt', { session: false }), multimediaUpload.deleteProducts);
app.post('/newsUpload', passport.authenticate('jwt', { session: false }), newsController.addNews);
app.post('/newsDelete', passport.authenticate('jwt', { session: false }), newsController.deleteNews);
app.post('/modifySeat', passport.authenticate('jwt', { session: false }), booking.modifySeat);
module.exports = app;