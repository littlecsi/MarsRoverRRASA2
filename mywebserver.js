var http = require('http');
var server = http.createServer(function(req, res){
    let htmlContent = “”;
    res.writeHead(200, {'Content-Type':'text/html'})
    res.end(htmlContent);
});

console.log('Server is running on port 3000');
server.listen(3000,'0.0.0.0');