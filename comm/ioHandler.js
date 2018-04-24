const Arena = require('../arena/arena');
const JSON = require('JSON');

const arena = new Arena(10);

const handle = function (server) {
    const io = require('socket.io')(server);

    io.on('connection', function (client) {
        console.log('server: client ' + client.id.toString() + ' connected.');

        /**
         * test event
         */
        client.on('test', function (data){
            data = JSON.parse(data);
            console.log(data);
            client.emit('testReply', 'got it.');
        });

        /**
         * broadcast test
         */
        client.on('broadcastTest', function (data) {
            data = JSON.parse(data);
            console.log('broadcast!');
            io.sockets.emit('testBroadcast', 'broadcast test.');
        });

        /**
         * new player add to room
         */
        client.on('openRoom', function (data) {
            data = JSON.parse(data);
            console.log('[comm/ioHandler]: on openRoom: receive msg: ' , data);
            let userId = data.userId;
            let auth = data.auth;
            arena.newPlayer(userId, function (ok, err, data) {
                if (err) {
                    console.log('[ioHandler/openRoom]: Error.');
                    io.to(roomId).emit('Error', err.toString());
                    return;
                }
                let roomId = data.roomId;
                console.log('[ioHandler/openRoom]: user ' +userId+ ' join Room ' + roomId);
                client.join(roomId);
                if (ok) {
                    io.to(roomId).emit('intoRoom', JSON.stringify(data));
                    io.to(roomId).emit('startGame', JSON.stringify({}));
                }
            });
        });

        /**
         * player ready to accept question
         */
        client.on('ready', function (data) {
            data = JSON.parse(data);
            console.log('[comm/ioHandler]: on ready: receive msg: ' , data);
            let roomId = data.roomId;
            arena.question(roomId, data, function (ok, err, data) {
                if (err) {
                    console.log('[ioHandler/openRoom]: Error.');
                    io.to(roomId).emit('Error', err.toString());
                    return;
                }
                if (ok) {
                    io.to(roomId).emit('question', JSON.stringify(data));
                }
            });
        });

        /**
         * judge
         */
        client.on('answer', function (data) {
            data = JSON.parse(data);
            console.log('[comm/ioHandler]: on answer: receive msg: ' , data);
            let roomId = data.roomId;
            arena.judge(roomId, data, function (ok, err, data) {
                if (err) {
                    console.log('[ioHandler/openRoom]: Error.');
                    io.to(roomId).emit('Error', err.toString());
                    return;
                }
                if (ok) {
                    io.to(roomId).emit('update', JSON.stringify(data));
                }
            });
        });

        /**
         * next round
         */
        client.on('nextRound', function (data) {
            data = JSON.parse(data);
            console.log('[comm/ioHandler]: on nextRound: receive msg: ' , data);
            let roomId = data.roomId;
            arena.nextRound(roomId, data, function (ok, err, data) {
                if (err) {
                    console.log('[ioHandler/openRoom]: Error.');
                    io.to(roomId).emit('Error', err.toString());
                    return;
                }
               if (ok) {
                    io.to(roomId).emit('startGame', JSON.stringify(data));
               }
            });
        });
    });
};

module.exports = handle;