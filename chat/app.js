const express = require('express');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const message = require("./model/message.js");
const event = require("./model/event.js");
const apiRouter = require("./routes/api");
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(__dirname));

app.use(express.json());

app.use(express.static('views'));

app.use("/api", apiRouter);

app.use(function(err, req, res,next) {
    res.status = err.status || 500;
    res.send(err);
});

app.get("/",function (req,res) {
    res.sendFile(__dirname+"/views/index.html");
});

io.on('connection', function (socket) {
    socket.on('message', function (data) {
        io.sockets.to(data.receiver).emit('message', data);

        new message(data).save(function (err,res) {
            if (err) {
                console.log("save message error:" + err);
            } else {
                console.log("save message ok:" + res);
            }
        });
    });

    socket.on('join',function (data) {
        //bind user info with socket obj
        if(!socket.room && !socket.user){
            socket.user = data.user;
            socket.room = data.room;

            new event({
                'id': socket.id,
                'type': 'connection',
                'user':  data.user,
                'room': data.room,
                'time': Date.parse(new Date()) / 1000
            }).save(function (err,res) {
                if (err) {
                    console.log("save connection event error:" + err);
                } else {
                    console.log("save connection event ok:" + res);
                }
            });
        }else{
            io.sockets.to(socket.room).emit('leave',{
                'id': socket.id,
                'type': 'leave',
                'user': socket.user,
                'room': socket.room,
                'time': Date.parse(new Date()) / 1000
            });
            
            socket.leave(socket.room);
        }

        socket.room = data.room;

        socket.join(data.room);

        io.sockets.to(data.room).emit('join',{
            'id': socket.id,
            'type': 'join',
            'user': socket.user,
            'room': data.room,
            'time': Date.parse(new Date()) / 1000
        });

        new event({
            'id': socket.id,
            'type': 'joined',
            'user': socket.user,
            'room': socket.room,
            'time': Date.parse(new Date()) / 1000
        }).save(function (err,res) {
            if (err) {
                console.log("save join event error:" + err);
            } else {
                console.log("save join event ok:" + res);
            }
        });
    });

    socket.on('error',function (data) {
        new event({
            'id': socket.id,
            'type': 'error',
            'user': socket.user,
            'room': socket.room,
            'time': Date.parse(new Date()) / 1000
        }).save(function (err,res) {
            if (err) {
                console.log("save error event error:" + err);
            } else {
                console.log("save error event ok:" + res);
            }
        });
    });

    socket.on('disconnect',function (data) {
        io.sockets.to(socket.room).emit('disconnect',{
            'id': socket.id,
            'type': 'disconnect',
            'user': socket.user,
            'room': socket.room,
            'time': Date.parse(new Date()) / 1000
        });

        new event({
            'id': socket.id,
            'type': 'disconnect',
            'user': socket.user,
            'room': socket.room,
            'time': Date.parse(new Date()) / 1000
        }).save(function (err,res) {
            if (err) {
                console.log("save disconnect event error:" + err);
            } else {
                console.log("save disconnect event ok:" + res);
            }
        });
    });
});

server.listen(3000,function () {
    console.log('socket.io connect successful');
});