const socket = io.connect('http://' + document.domain + ':' + location.port);

let uId;
let rId;

let score = 0;
let magic = 0;

socket.on('testBroadcast', function (data) {
    data = JSON.parse(data);
    console.log(data)
});

socket.on('testReply', function (data) {
    data = JSON.parse(data);
    console.log(data)
});

socket.on('connect', function() {
    console.log('connected.')
});
socket.on('intoRoom', function (data) {
    data = JSON.parse(data);
    console.log('>>>>>intoRoom');
    console.log(data);
    rId = data.roomId;
});
socket.on('startGame', function (data) {
    data = JSON.parse(data);
    console.log('>>>>>startGame');
    console.log(data);
});
socket.on('question', function (data) {
    data = JSON.parse(data);
    console.log('>>>>>question');
    console.log(data);
});
socket.on('update', function (data) {
    data = JSON.parse(data);
    console.log('>>>>>update');
    console.log(data);
    let players = data.players;
    let idx = 0;
    if (players[1].userId === uId) idx = 1;
    score = players[idx].score;
    magic = players[idx].magic;
    socket.emit('nextRound', JSON.stringify({
        userId: uId,
        roomId: rId
    }));
});

const openRoom = function (userId) {
    uId = userId;
    socket.emit('openRoom', JSON.stringify({
        userId: userId,
        auth: '***'
    }));
};

const ready = function () {
    socket.emit('ready', JSON.stringify({
        userId: uId,
        roomId: rId
    }));
};

const answer = function (as) {
    socket.emit('answer', JSON.stringify({
        userId: uId,
        roomId: rId,
        data: {
            answer: as,
            score: 0,
            magic: 0,
            combo: 0,
            board: ['c0', 'c1', 'c2']
        }
    }));
};