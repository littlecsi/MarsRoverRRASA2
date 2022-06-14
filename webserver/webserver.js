var express = require('express');
var server = express();

server.get('/', function(req, res) {
    res.sendFile('/home/ubuntu/home.html');
});

server.get('/direction.js', function(req, res) {
    res.sendFile('/home/ubuntu/direction.js');
});
   
console.log('Server is running on port 3000');
server.listen(3000,'0.0.0.0');