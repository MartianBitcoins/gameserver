var assert = require('better-assert');
var fs = require('fs');
var path = require('path');

var socket = require('./server/socket');
var database = require('./server/database');
var Game = require('./server/game');
var Chat = require('./server/chat');
var GameHistory = require('./server/game_history');

var port = process.env.PORT || 3842;

var server;

if (process.env.USE_HTTPS) {
    var options = {
        key: fs.readFileSync(process.env.HTTPS_KEY || path.join(__dirname, '/key.pem')),
        cert: fs.readFileSync(process.env.HTTPS_CERT || path.join(__dirname, 'cert.pem'))
    };

    server = require('https').createServer(options).listen(port, function() {
        console.log('Listening on port ', port, ' on HTTPS!');
    });
} else {
    server = require('http').createServer().listen(port, function() {
        console.log('Listening on port ', port, ' with http');
    });
}

database.getGameHistory(function(err,rows) {
    if (err) {
        console.error('[INTERNAL_ERROR] got error: ', err,
            'Unable to get table history');
        throw err;
    }

    var gameHistory = new GameHistory(rows);
    var game = new Game(gameHistory);
    var chat = new Chat();

    process.on('SIGTERM', function() {
        console.log('Got SIGTERM... triggering emergency shutdown');
        game.shutDownFast();
    });

    socket(server, game, chat);
});