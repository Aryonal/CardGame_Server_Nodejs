
var Arena = function (vol) {
    this.waitingList = []; // element: [roomId, userId]
    this.roomMap = new Map(); // key: roomId, value: room object
    this.playerList = [];
};

Arena.prototype.newPlayer = function (userId, callback) {
    // TODO: add user to a room, return roomId
    // TODO: add userId and roomId to list
    // TODO: data = {roomId: 'r123', players:[]};
    // TODO: callback(ready, data)
};

Arena.prototype.question = function (roomId, data, callback) {
    room = roomMap.get(roomId);
    room.newQuestion(data, callback);
};

Arena.prototype.judge = function (roomId, data, callback) {
    //
};

module.exports = Arena;