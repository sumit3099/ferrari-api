let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let multimediaSchema = new Schema({
    multimediaId: Number,
    title: String,
    description: String,
    thumbnail: String,
    url: String,
    type: {
        type: String,
        enum: ['image', 'video']
    },
    category: String,
    level: String,
    date: Date,
    comments: [{
        userId: {
            type: String,
        },
        userName: {
            type: String,
        },
        comment: {
            type: String
        },
        date: {
            type: Date
        }
    }]
})
let Multimedia = mongoose.model('Multimedia', multimediaSchema, 'Multimedia');
module.exports = Multimedia;