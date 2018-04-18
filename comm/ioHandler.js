const room = require('../arena/room');
const json = require('JSON');

var handle = function (server) {
    const io = require('socket.io')(server);

    io.on('connection', function (client) {
        console.log('server: client ' + client.id.toString() + ' connected.');

        /**
         * test event
         */
        client.on('test', function (data){
            console.log(data);
            client.emit('testReply', 'got it.');
        });

        /**
         * broadcast test
         */
        client.on('broadcastTest', function (data) {
            console.log('broadcast!');
            io.sockets.emit('testBroadcast', 'broadcast test.');
            // client.broadcast.emit('broad', 'broadcast test.'); // this client won't receive msg.
        });

        /**
         * new player add to room
         */
        client.on('openRoom', function (data) {
            console.log('[comm/ioHandler]: on openRoom: receive msg: ' + data.toString());
            userId = data.userId;
            auth = data.auth;
            // TODO: arena add new player
            arena.newPlayer(userId, function (ok, data) {
                if(ok) {
                    roomId = data.roomId;
                    client.join(roomId);
                    io.to(roomId).emit('intoRoom', data);
                    io.to(roomId).emit('startGame', data);
                    // client.to(room).emit('reply', 'new member.'); // this client won't receive this msg.
                }
            });
        });

        /**
         * player ready to accept question
         */
        client.on('ready', function (data) {
            console.log('[comm/ioHandler]: on ready: receive msg: ' + data.toString());
            userId = data.userId;
            roomId = data.roomId;
            // TODO: arena.room pop new question

        });

        /**
         * judge
         */
    });
};

module.exports = handle;