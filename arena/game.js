/**
 * game rules
 */



/**
 *
 * @param room: Room
 * @param callback: function(gameOver, winUserId)
 */
const judge = function (room, callback) {
    // TODO: whether game over
    // TODO: who wins
    // TODO: who got right answer
    // TODO: update score and magic
    callback(false, room.playerIds[0]);
};

module.exports = {
    judge : judge
};