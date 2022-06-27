const express = require('express'); // express js
const app = express();

var CurrentPosition = ["undefined","undefined"];
var globalAngle = 0;
var viewReceived = false;

//NO CLUE?
//create map logic not mine
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


function dataProccessing(data) {  
    const step = 25;
    var numberOfDetections = 0;
    console.log('connection data from %s: %j', remoteAddress, data.toString());
    if(data.toString().charAt(0) === '1') {
        var batteryData = data.toString().split(",");
        website.emit("BatteryData", [batteryData]);
    } 
    if(data.toString().charAt(0) === '[') { // special starting character for view data
        var viewData = data.toString().substring(1).slice(0, -1);
        website.emit("ViewData", [viewData]);
        view = viewData;
        viewReceived = true;
    }
    while(numberOfDetections < 7) {
        while(viewReceived = true){
            viewReceived = false;
            numberOfDetections = numberOfDetections + 1
            var map = createMap(step, view);
        }
        
    }
}


//connection to web client

const server = app.listen(8000, () => {
    console.log("Application started and listening on port 8000");
});

var website;
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    console.log('user connected');
    website = socket;
    socket.once('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('data', dataProccessing);
    socket.on('Angle', data => {
        console.log("Angle from Manual Driving : %s", data);
        if(esp32 !== "undefined") {
            esp32.write("ANG" + data);
        }
        socket.emit('Angle', data);
    });
    socket.on('Distance', data => {
        console.log("Distance from Manual Driving : %s", data);
        if(esp32 !== "undefined") {
            esp32.write("DIS" + data);
        }
        socket.emit('Distance', data);
    });
    socket.on('Speed', data => {
        console.log("Speed from Manual Driving : %s", data);
        if(esp32 !== "undefined") {
            esp32.write("SPE" + data);
        }
        socket.emit('Speed', data);
    });
    socket.on('Command', data => {
        console.log("Switch for Automated Driving : %s", data);
        if (data === "start"){
            //start automated driving
        }
        else if(data ==="stop"){
            //stop automated driving
        }
    });
    socket.on("CurrentPosition", data => {
    globalAngle = Number(data[1]);
    CurrentPosition = [Number(data[0][0]),Number(data[0][1])];
})
});