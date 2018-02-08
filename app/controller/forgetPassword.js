const Users = require('../imports/models/users');
const crypto = require('crypto');
const transporter = require('../imports/transporter');

exports.sendKey = async(req, res) => {
    email = req.body.email;
    let user = await Users.findOne({
        email: email
    });
    if (!user) {
        res.send({
            error: "user not found"
        });
    } else {   
        let date=new Date();
        const key = crypto.createHmac('sha256', date.toString()).update(email).digest('hex');
        let message = {
            from: 'Team Ferrari <teamferrari@mindtree.com>',
            to: email,
            subject: 'Password Reset Key',
            text: 'Hello to Devesh, your password reset key is  ' + key,
            html: '<p>Hello <b> ' + user.name + '</b><br><br> Your password reset key is <b>' + key + '</b>.<br><br>Thanks, <br>Team Ferrari F1 Fan Club</p>'
        };
        transporter.sendMail(message);
        res.send({
            data: key
        });
    }
}
exports.setPassword = (req, res) => {
    email = req.body.email;
    newPassword = req.body.password;
    Users.findOneAndUpdate({
        email: email
    }, {
        password: newPassword
    }, {
        upsert:true
    },(err, result) => {
        if (err) {
            res.send({
                error: err
            });
        } else {
            res.send({
                data: "successful"
            });
        }
    })
}