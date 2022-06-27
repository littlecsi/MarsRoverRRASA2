var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var htmlParser = require('node-html-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));


let htmlContent = `
<!DOCTYPE html>
<html>
    <body>
        <h2>Enter a number to test if it is Prime</h2>
        <form action="/primality-test" method="post" id="form1">
            <!-- this is a comment: br tag is for line break-->
            <label for="num1">Input number:</label><br>
            <input type="text" id="num1" name="num1"><br>
            <input type="submit" value="Check!">
        </form>
    </body>
</html>
`;

function primeOrNot(num){
    if(num<2){
        return" not a prime"
    }
    else if(num==2){
        return" a prime"
    }
    else{
        const rootnum = Math.sqrt(num);
        for(let d=2; d<rootnum; d++){
            if(num%d==0){
                return" not a prime"
            }
        }
        return" a prime"
    
    }
}

server.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(htmlContent);
});

server.post('/primality-test', function(req, res) {
     //formData is a JavaScript object
    const formData = req.body;
    const responseContent = "<p>The number is"+ primeOrNot(formData.num1)+"</p>";
    let htmlTree = htmlParser.parse(htmlContent);
htmlTree.getElementById("form1").insertAdjacentHTML("afterend",responseContent);
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(htmlTree.toString());
});
console.log('Server is running on port 3000');
server.listen(3000,'0.0.0.0');
