var socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connect', function() {
    console.log('connected.')
});
socket.on('intoRoom', function (data) {
    console.log(data);
});
socket.on('question', function (data) {
    console.log(data);
});

var openRoom = function (userId) {
    socket.emit('openRoom', {
        userId: userId,
        auth: '***'
    })
};

var ready = function () {
    socket.emit('ready')
};