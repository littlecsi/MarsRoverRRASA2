var express = require('express');
var server = express();

function getstarted(){
    window.location.href ='command.html';
}
function home(){
    window.location.href ='/';
}
function command(){
    window.location.href ='command.html';
}

function battery(){
    window.location.href ='battery.html';
}

function about(){
    window.location.href ='about.html';
}

function sendcontrol(){
    server.post('/controldata', function(req, res) {
    //formData is a JavaScript object
        const formData = req.body;
        const responseContent = "<p>sent</p>";
    
        /*fileSystem.readFile('/Users/sbaig/index.html', 'utf8', function(err,data){
        if(err){
            console.error(err);
        return;
        }
        return data;
        });*/
    
        const htmlContent = fileSystem.readFileSync('/home/ubuntu/command.html', 'utf8');
        let htmlTree = htmlParser.parse(htmlContent);
        htmlTree.getElementById("controldata").insertAdjacentHTML("afterend",responseContent);
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(htmlTree.toString());
    });
        
}