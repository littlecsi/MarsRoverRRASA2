const express = require('express'); // express js
const app = express();

var CurrentPosition = ["undefined","undefined"];
var globalAngle = 0;

//NO CLUE?
function createMap(step, view) {
    let width = 1; // an element represents 5cm x 5cm box
    let extra = 10; // extra width
    var largestWidth = view[0][1] !== 0 ? Math.abs(view[0][0]) : 1;
    var furthestAway = view[0][1];
    for(let i = 1; i < view.length; i++) {
        if(Math.abs(view[i][0]) > largestWidth) {
            largestWidth = Math.abs(view[i][0]);
        }
        if(view[i][1] > furthestAway) {
            furthestAway = view[i][1];
        }
    }
    var graphWidth = Math.ceil((largestWidth + 15 + extra) * 2 / width);
    var graphHeight = Math.max(Math.ceil(step / width)+1, Math.ceil((furthestAway + 15 + 1) / width) );
    var result = Array(graphHeight);
    for(let i = 0; i < graphHeight; i++) {
        result[i] = Array(graphWidth).fill(1);
    }
    view.forEach(detection => {
        if(detection[1] !== 0) {
            var detectionX = detection[0] > 0 ? graphWidth/2 + Math.ceil(detection[0]/width) : graphWidth/2 + Math.floor(obstacle[0]/width);
            for(let i = Math.ceil(detection[1]/width) - Math.ceil(15/width); i < Math.ceil(detection[1]/width) + Math.ceil(15/width); i++) {
                for(let j = Math.ceil(detectionX) - Math.ceil(15/width); j < Math.ceil(detectionX) + Math.ceil(15/width); j++) {
                    result[i][j] = 0;
                }
            }
        }
    });
    var blocked = false;
    var distanceAfterDetection = 0;
    var distanceBeforeDetection = 0;
    if(result[Math.ceil(step)][Math.ceil(result[0].length/2)-1] === 0) {
        blocked = true;
        let i = Math.ceil(step);
        for(let i = Math.ceil(step); i < result.length; i++) {
            if(result[i][Math.ceil(result[0].length/2)-1] === 1) {
                distanceAfterDetection = i;
                break
            }
        }
        for(let i = Math.ceil(step)-1; i >= 0; i--) {
            if(result[i][Math.ceil(result[0].length/2)-1] === 1) {
                distanceBeforeDetection = i;
                break
            }
        }
    }
    return [result, blocked, distanceAfterDetection, distanceBeforeDetection];
}


// TCP server communicates with the ESP32    //change to https
var net = require('net');
var tcpserver = net.createServer();
var esp32 = "undefined";4
tcpserver.on('connection', handleConnection);
const tcphost = '0.0.0.0'; // localhost
const tcpport = 9000;
tcpserver.listen(tcpport, tcphost, function() {
    console.log('Server is listening to %j', tcpserver.address());
});

function handleConnection(socket) {
    esp32 = socket; 
    CurrentPosition = [0,0];
    console.log('ESP32 socket stored');
    var remoteAddress = socket.remoteAddress + ':' + socket.remotePort;  
    console.log('TCP: new client connection from %s', remoteAddress);
    socket.write("You are connected");
    socket.on('data', DataProccessing);  
    socket.once('close', onConnClose);  
    socket.on('error', onConnError);

function DataProccessing(data) {  
    const step = 25;
    var obstaclesFound = [];
    console.log('connection data from %s: %j', remoteAddress, data.toString());
    if(data.toString().charAt(0) === '1') {
        var batteryData = data.toString().split(",");
        website.emit("BatteryData", [batteryData]);
    } 
    if(data.toString().charAt(0) === '$') {
        website.emit("Detection", ["pink", [2,10]]);
    }
    if(data.toString().charAt(0) === '[') { // special starting character for view data
        var viewData = data.toString().substring(1).slice(0, -1).split(";");
        for(let i = 0; i < viewData.length; i++) {
        viewData[i] = viewData[i].split(",");
        viewData[i][0] = Number(viewData[i][0]);
        viewData[i][1] = Number(viewData[i][1]);
        }
        view = viewData;
        viewReceived = true;
    }
    //conn.write(d); send back to client
    while(!back && obstaclesFound.length < 5) {
        while(!viewReceived);
        viewReceived = false;
        if(view[0][1] !== 0 && !obstaclesFound.includes("fuchsia")) {
            obstaclesFound.push("fuchsia");
            website.emit("Detection: ", ["fuchsia", view[0]]);
        }
        if(view[1][1] !== 0 && !obstaclesFound.includes("green")) {
            obstaclesFound.push("green");
            website.emit("Detection: ", ["green", view[1]]);
        }
        if(view[2][1] !== 0 && !obstaclesFound.includes("blue")) {
            obstaclesFound.push("blue");
            website.emit("Detection: ", ["blue", view[2]]);
        }
        if(view[3][1] !== 0 && !obstaclesFound.includes("yellow")) {
            obstaclesFound.push("yellow");
            website.emit("Detection: ", ["yellow", view[3]]);
        }
        if(view[4][1] !== 0 && !obstaclesFound.includes("red")) {
            obstaclesFound.push("red");
            website.emit("Detection: ", ["red", view[4]]);
        }
        if(view[4][1] !== 0 && !obstaclesFound.includes("teal")) {
            obstaclesFound.push("teal");
            website.emit("Detection: ", ["teal", view[4]]);
        }
        var map = createMap(step, view);
        
    }
}
}

function onConnClose() {  
    console.log('connection from %s closed', remoteAddress);  
}
function onConnError(err) {  
    console.log('Connection %s error: %s', remoteAddress, err.message); 
}


//connection to web client
const server = app.listen(8000, () => {
    console.log("Application started and listening on port 8000");
});

var website;
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    console.log('user connected');
    website = socket; // storing website client
    socket.once('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on("CurrentPosition", data => {
    globalAngle = Number(data[1]);
    CurrentPosition = [Number(data[0][0]),Number(data[0][1])];
})
});