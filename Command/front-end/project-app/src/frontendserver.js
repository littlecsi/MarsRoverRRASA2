const express = require('express'); // express js
const app = express();

var CurrentPosition = ["undefined","undefined"];
var globalAngle = 0;
var viewReceived = false;

//NO CLUE?
//create map logic not mine
function createMap(step, view) {
}

function dataProccessing(data) {  
    const step = 25;
    var numberOfDetections = 0;
    console.log('connection data from %s: %j', remoteAddress, data.toString());
    if(data.toString().charAt(0) === 'B:') {
        var batteryData = data.toString().substring(2);
        website.emit("BatteryData", [batteryData]);
    } 
    if(data.toString().charAt(0) === 'V:') { // special starting character for view data
        var viewData = data.toString().substring(2);
        website.emit("ViewData", [viewData]);
        view = viewData;
        viewReceived = true;
    }
    if(data.toString().charAt(0) === 'GA:') { // special starting character for view data
        var globalAngle = data.toString().substring(3);
        website.emit("GlobalAngle", [global_angle]);
    }
    if(data.toString().charAt(0) === 'P:') { // special starting character for view data
        var roverPosition = data.toString().substring(2);
        website.emit("RoverPosition", [roverPosition]);
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

});
