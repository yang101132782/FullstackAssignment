var mongoose = require('../db.js'), Schema = mongoose.Schema;

Schema = mongoose.Schema;

var Message = new Schema({
    id: {type: Number},
    sender: {type: String},
    header: {type: String},
    receiver: {type: String}, //receiver name /room name
    message: {type: String},
    time: {type: Number} //send message timestamp
});
module.exports = mongoose.model('Message', Message,'message');