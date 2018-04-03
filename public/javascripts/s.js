const socket = io('http://localhost:3000');

socket.on('connect', function() {
    console.log('client connected.')
});

socket.on('reply', function(data) {
    console.log('got reply: ' + data);
});

socket.on('broad', function(data) {
    console.log('got broad: ' + data);
});
