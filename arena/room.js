const db = require('./db');
const game = require('./game');
const Emitter = require('events');

const e = new Emitter();

db.init(function (err, result) {
    if (err) {
        console.log('[room/]: initiate error ' + err.toString());
    } else {
        console.log('[room/]: result: ' + result.toString());
    }
});

db.init_test(function (err, result) {
    if (err) {
        console.log('[room/]: initiate test error ' + err.toString());
    } else {
        console.log('[room/]: test result: ' + result.toString());
    }
});

/**
 * @param userId: string
 * @param callback: function (ok, err, data)
 */
e.on('newPlayer', function (room, userId, callback) {
    console.log('[room/newPlayer]: new player ' + userId);
    // add player to room
    // init a player here
    room.players.set(userId, {
        ready: true,
        board: [],
        stage: [],
        magic: 0,
        score: 0,
        answer: -1,
        combo: -1,
        win: 0,
        all: 0
    });
    room.playerIds.push(userId);
    db.get('user', userId, function (err, data) {
        if (err) {
            console.log(err.toString());
            callback(false, err, {});
            return;
        }
        // update room player data
        room.players.get(userId).stage = data.stage;
        room.players.get(userId).win = data.win;
        room.players.get(userId).all = data.all;
        // check if ready
        if (room._isReady()) {
            console.log('[room/newPlayer]: ready.');
            room._resetReady();
            callback(true, false, {
                roomId: room.id,
                players: room.playerIds
            });
        } else {
            console.log('[room/newPlayer]: not ready.');
            callback(false, false, {roomId: room.id});
        }
    });
});

/**
 * @param data: object {
 *          userId,
 *          roomId
 *       }
 * @param callback: function(ok, err, data)
 */
e.on('newQuestion', function (room, data, callback) {
    console.log('[room/newQuestion]: player ' + data.userId + ' ready');
    room.players.get(data.userId).ready = true;
    // TODO: check if ready
    if (room._isReady()) {
        room._resetReady();
        db.get('question', 0, function (err, data) {
            if (err) {
                console.log(err.toString());
                callback(false, err, {});
                return;
            }
            room.question = data.question;
            room.answer = data.answer;
            callback(true, false, {
                question: room.question,
                options: data.options
            });
        });
    } else {
        callback(false, false, {});
    }
});

/**
 * @param data: object {
 *          userId,
 *          roomId,
 *          data: {
 *                  magic,
 *                  score,
 *                  combo,
 *                  answer,
 *                  board
 *                }
 *       }
 * @param callback: function (ok, err, data)
 */
e.on('judge', function (room, data, callback) {
    // TODO: check if identical
    let userId = data.userId;
    if (room._isIdentical(data)) {
        room._updatePlayer(data);
        room.players.get(userId).ready = true;
        if (room._isReady()) {
            room._resetReady();
            game.judge(room, function (err, gameOver, winUserId) {
                if (err) {
                    console.log(err.toString());
                    callback(false, err, {});
                    return;
                }
                let players = room._playersToList(winUserId);
                callback(true, false, {
                    gameOver: gameOver,
                    players: players
                });
                if (gameOver) {
                    room.players.get(winUserId).win ++;
                    room.players.get(room.playerIds[0]).all ++;
                    room.players.get(room.playerIds[1]).all ++;
                    // TODO: db.update('user', id, callback)
                    // TODO: db.update('card', id, callback)
                }
            });
        } else {
            callback(false, false, {});
        }
    } else {
        // TODO: raise error
        callback(false, new Error('Game Value Error.'), {});
    }
});

/**
 * @param room
 * @param data: object {
 *          userId,
 *          roomId
 *          }
 * @param callback: function (ok, err, data)
 */
e.on('nextRound', function (room, data, callback) {
    let userId = data.userId;
    room.players.get(userId).ready = true;
    if (room._isReady()) {
        room._resetReady();
        room.round ++;
        callback(true, false, {
            round: room.round
        });
    } else {
        callback(false, false, {});
    }
});

const Room = function(roomId, vol) {
    this.id = roomId;
    this.vol = vol;
    this.playerIds = [];
    this.players = new Map(); //key: userId, value: player object
    this.question = '';
    this.answer = -1;
    this.round = 0;
};

Room.prototype._isReady = function () {
    if (this.players.size < this.vol) return false;
    for (let [k,v] of this.players.entries()) {
        console.log('[room/_isReady]: ' + k + ', ready: ' + v.ready.toString());
        if (!v.ready) return false;
    }
    return true;
};

Room.prototype._resetReady = function () {
    for (let k of this.players.keys()) {
        this.players.get(k).ready = false;
    }
};

/**
 *
 * @param data: object {
 *                 userId,
 *                 roomId,
 *                 data: {
 *                      magic,
 *                      score,
 *                      combo,
 *                      answer,
 *                      board
 *                  }
 *              }
 * @returns {boolean}
 * @private
 */
Room.prototype._isIdentical = function (data) {
    let userId = data.userId;
    let magic = data.data.magic;
    let score = data.data.score;
    return (magic === this.players.get(userId).magic && score === this.players.get(userId).score);
};

/**
 *
 * @param data: object {
 *                 userId,
 *                 roomId,
 *                 data: {
 *                      magic,
 *                      score,
 *                      combo,
 *                      answer,
 *                      board
 *                  }
 *              }
 * @private
 */
Room.prototype._updatePlayer = function (data) {
    let player = this.players.get(data.userId);
    player.score = data.data.score;
    player.magic = data.data.magic;
    player.combo = data.data.combo;
    player.answer = data.data.answer;
    player.board = data.data.board;
};

/**
 *
 * @returns {Array}
 * @private
 */
Room.prototype._playersToList = function (winUserId) {
    let r = [];
    this.playerIds.forEach((k) => {
       r.push({
           userId: k,
           right: this.players.get(k).answer === this.answer,
           win: k === winUserId,
           magic: this.players.get(k).magic,
           score: this.players.get(k).score
       });
    });
    return r;
};

Room.prototype.newPlayer = function (userId, callback) {
    e.emit('newPlayer', this, userId, callback);
};

Room.prototype.newQuestion = function (data, callback) {
    e.emit('newQuestion', this, data, callback);
};

Room.prototype.judge = function (data, callback) {
    e.emit('judge', this, data, callback);
};

Room.prototype.nextRound = function (data, callback) {
    e.emit('nextRound', this, data, callback);
};

module.exports = Room;