const Room = require('./room');
const Emitter = require('events');

const e = new Emitter();

e.on('newPlayer', function (arena, userId, callback) {
    console.log('[Arena/newPlayer]: new player.' + userId);
    let room;
    if (!arena.waitingList.length) {
        if (!arena._restRoomId.length) {
            callback(false, {});
            return;
        }
        let roomId = arena._popRoomId();
        room = new Room(roomId, 2);
        arena.roomMap.set(roomId, room);
        arena.waitingList.push([roomId, userId]);
    } else {
        let roomId = (arena._match(userId))[0];
        room = arena.roomMap.get(roomId);
    }

    arena.playerList.push(userId);
    room.newPlayer(userId, callback);
});

e.on('question', function (arena, roomId, data, callback) {
    let room = arena.roomMap.get(roomId);
    room.newQuestion(data, callback);
});

e.on('judge', function (arena, roomId, data, callback) {
    let room = arena.roomMap.get(roomId);
    room.judge(data, callback);
});

e.on('nextRound', function (arena, roomId, data, callback) {
    let room = arena.roomMap.get(roomId);
    room.nextRound(data, callback);
});

const Arena = function (vol) {
    this.vol = vol;
    this.waitingList = []; // element: [roomId, userId]
    this.roomMap = new Map(); // key: roomId, value: room object
    this.playerList = [];

    this._restRoomId = new Array(vol);
    for (let i = 0; i < vol; i ++) {
        this._restRoomId[i] = 'u' + i.toString();
    }
};

Arena.prototype._popRoomId = function () {
    return this._restRoomId.pop();
};

Arena.prototype._match = function (userId) {
    // TODO: how to match player
    return this.waitingList.pop();
};

Arena.prototype.newPlayer = function (userId, callback) {
    e.emit('newPlayer', this, userId, callback);
};

Arena.prototype.question = function (roomId, data, callback) {
    e.emit('question', this, roomId, data, callback);
};

Arena.prototype.judge = function (roomId, data, callback) {
    e.emit('judge', this, roomId, data, callback);
};

Arena.prototype.nextRound = function (roomId, data, callback) {
    e.emit('nextRound', this, roomId, data, callback);
};

module.exports = Arena;