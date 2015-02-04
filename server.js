'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
    socket = require('socket.io'),
	chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db , function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>

var server = app.listen(config.port);
var io = socket.listen(server);

io.on('connection', function (socket) {
    console.log('on connection');

    socket.on('subscribe', function(data) { socket.join(data.guid); });

    socket.on('unsubscribe', function(data) { socket.leave(data.guid); });

    socket.on('src',function(data){
        socket.to(data.tvId).emit('src', data);
        console.log(data);
    });
    socket.on('src-qq',function(data){
        socket.to(data.tvId).emit('src-qq', data);
        console.log(data);
    });
    socket.on('play',function(data){
        socket.to(data.tvId).emit('play', data);
        console.log(data);
    });
    socket.on('pause',function(data){
        socket.to(data.tvId).emit('pause', data);
        console.log(data);
    });
    socket.on('ready',function(data){
        socket.to(data.tvId).emit('ready', data);
        console.log(data);
    });
});




// Expose app
module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
