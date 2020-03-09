const express = require("express");
const async = require("async");
const message = require("../model/message.js");
const event = require("../model/event.js");
const router = express.Router();

function json(data, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
}

//search all message
router.get("/history", function (req, res) {
    // console.log(""+req.params.key);
    message.find({}, function (err, result) {
        if (err) {
            json({"error": err.toString()}, res)
        } else {
            json(result, res)
        }
    })
});

//search all chatroom
router.post("/roomlist", function (req, res) {
    // console.log(req.body);
    var condition = '';
    if (req.body.roomname) {
        condition = {'receiver': req.body.roomname};
    } else {
        condition = {};
    }

    message.distinct('receiver', condition, function (err, result) {
        if (err) {
            json({"error": err.toString()}, res)
        } else {
            async.map(result, function (item, callback) {
                message.findOne({'receiver':item}).sort({"time":-1}).exec(function (err,receiver) {
                    if (err) {
                        json({"error": err.toString()}, res)
                    } else {
                        var array = {};
                        // console.log(receiver);
                        array.message = receiver.message;
                        array.header = receiver.header;
                        array.name = receiver.receiver;
                        array.sender = receiver.sender;
                        callback(null, array);
                    }
                })

            }, function (err, results) {
                json(results, res)
            });
        }
    })
});

//search all message by room name
router.post("/roomhistory", function (req, res) {
    // console.log(req.body);
    var condition = '';
    if (req.body.roomname) {
        condition = {'receiver': req.body.roomname};
    } else {
        condition = {};
    }
    message.find(condition, function (err, result) {
        if (err) {
            json({"error": err.toString()}, res)
        } else {
            json(result, res)
        }
    })
});


//search all message
router.get("/eventlog", function (req, res) {
    // console.log(""+req.params.key);
    event.find({}, function (err, result) {
        if (err) {
            json({"error": err.toString()}, res)
        } else {
            json(result, res)
        }
    })
});

module.exports = router;
