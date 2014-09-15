var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

function updateUserCount(change) {
    userCount += change;
    io.emit('userCountChanged', userCount);
}

app.get('/', function(request, response) {
    response.sendfile('index.html');
});

var userCount = 0;

io.on('connect', function(socket) {

    // Update the user count
    updateUserCount(+1);

    // Read my doc.txt
    fs.readFile('doc.txt', 'utf8', function(err, contents) {
        io.emit('fileRead', contents);
    })

    socket.on('disconnect', function() {
        updateUserCount(-1);
    });

    socket.on('textUpdated', function(newText) {
        fs.writeFile('doc.txt', newText);
            io.emit('fileRead', newText);
    });
});

console.log('Server starting on http://localhost:3000');

http.listen(3000);

