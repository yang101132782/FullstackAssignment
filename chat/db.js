var mongoose = require('mongoose'),DB_URL = 'mongodb://chat:1996qqcaoyang@cluster0-shard-00-00-fgac8.mongodb.net:27017,cluster0-shard-00-01-fgac8.mongodb.net:27017,cluster0-shard-00-02-fgac8.mongodb.net:27017/chat?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
/** * connected */
mongoose.connect(DB_URL);

/** * connect success */
mongoose.connection.on('connected', function () {
    console.log('connected to mongodb successful')
});

/** * connect error */
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

/** * disconnect */
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

module.exports = mongoose;