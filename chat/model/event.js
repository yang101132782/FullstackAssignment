var mongoose = require('../db.js'), Schema = mongoose.Schema;

Schema = mongoose.Schema;

var Event = new Schema({
    id:   {type: String},
    type: {type: String},
    user: {type: String},
    room: {type: String},
    time: {type: Number}
});

module.exports = mongoose.model('Event', Event, 'event');