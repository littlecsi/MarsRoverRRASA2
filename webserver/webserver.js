var express = require('express');
var server = express();

server.get('/', function(req, res) {
    res.sendFile('/home/ubuntu/home.html');
});
server.get('/command.html', function(req, res) {
    res.sendFile('/home/ubuntu/command.html');
});
server.get('/about.html', function(req, res) {
    res.sendFile('/home/ubuntu/about.html');
});
server.get('/battery.html', function(req, res) {
    res.sendFile('/home/ubuntu/battery.html');
});
server.get('/about.html', function(req, res) {
    res.sendFile('/home/ubuntu/about.html');
});


server.get('/direction.js', function(req, res) {
    res.sendFile('/home/ubuntu/direction.js');
});
   
console.log('Server is running on port 3000');
server.listen(3000,'0.0.0.0');