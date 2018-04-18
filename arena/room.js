var db = require('db');
var Emitter = require('events');

var e = new Emitter();

e.on('newPlayer', function (room, userId, callback) {
    // TODO: add player to room
    room.players.set(userId, {
        ready: false,
        board: [],
        pool: [],
        magic: 0,
        score: 0,
        win: 0,
        all: 0
    });
    db.get('user', userId, function (err, data) {
        // TODO: update player data

        // TODO: check if ready
        // TODO: callback(ok, data)
        if (room._isReady()) {
            room._resetReady();
            callback(true, {
                roomId: room.id,
                players: Array.from(room.players.entries())
            });
        } else {
            callback(false, {});
        }
    });
});

e.on('newQuestion', function (room, data, callback) {
    // TODO: check if ready
    // TODO: pop new question
    // TODO: update room.question and room.answer
    // TODO: callback(ok, data)
});

e.on('judge', function (room, data, callback) {
    // TODO: update player data
    // TODO: check if ready
    // TODO: judge
    // TODO: callback(ok, data)
});

var Room = function(roomId) {
    this.id = roomId;
    this.players = new Map(); //key: userId, value: player object
    this.question = '';
    this.answer = -1;
    this.round = 0;
};

Room.prototype._isReady = function () {
    for (var k of this.players.keys()) {
        if (!this.players.get(k).ready) return false;
    }
    return true;
};

Room.prototype._resetReady = function () {
    for (var k of this.players.keys()) {
        this.players.get(k).ready = false;
    }
};

Room.prototype.newPlayer = function (userId, callback) {
    e.emit('newPlayer', this, userId, callback);
};

Room.prototype.newQuestion = function (msg, callback) {
    e.emit('newQuestion', this, msg, callback);
};

Room.prototype.judge = function (msg, callback) {
    e.emit('judge', this, msg, callback);
};

module.exports = Room;