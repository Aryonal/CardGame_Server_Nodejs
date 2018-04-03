const room = require('../arena/room');
const json = require('JSON');

var handle = function (server) {
    const io = require('socket.io')(server);

    io.on('connection', function (client) {
        console.log('server: client ' + client.id.toString() + ' connected.');

        /**
         * on msg
         */
        client.on('msg', function (data){
            console.log(data);
            client.emit('reply', 'got it.');
        });

        /**
         * 
         */
        client.on('broadcast', function (data) {
            console.log('broadcast!');
            io.sockets.emit('broad', 'broadcast test.');
            // client.broadcast.emit('broad', 'broadcast test.'); // this client won't receive msg.
        });

        /**
         * join room
         */
        client.on('joinRoom', function (room) {
           console.log('new member to join ' + room.toString());
           client.join(room);
           io.to(room).emit('reply', 'new member.');
           // client.to(room).emit('reply', 'new member.'); // this client won't receive this msg.
        });
    });
};

module.exports = handle;