// Https server communicates with the ESP32 
const http = require("http"); 
var fileSystem = require("fs");
var express = require('express');
var bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
const httphost = 'localhost';
const httpport = 80;
// Creating object of key and certificate
// for SSL
const options = {
    key: fileSystem.readFileSync("server.key"),
    cert: fileSystem.readFileSync("server.cert"),
};

// Creating https server by passing
// options and app object
http.createServer(options, server)
.listen(80, function (req, res) {
    console.log("Server running on ",httphost," at port " , httpport ,": " );
});
// Get request for root of the server
server.get("/", function (req, res) {
    if (res.statusCode !== 200) {
        console.error(`Did not get an OK from the server. Status Code: ${res.statusCode}`);
        res.resume();
        return;
    }
    let data=[];
    res.on('data',chunk => {
        data.push(chunk);
    });

    res.on('end',() => {
        console.log('resposne ended, recieved: ')
        console.log(JSON.parse(data));
    });
    // Sending index.html to the browser
    // res.sendFile("/index.html");
}).on('error',err => {
    console.log('Error: ', err.message);
});


