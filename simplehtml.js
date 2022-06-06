var http = require('http');
let htmlContent = `
<!DOCTYPE html>
<html>
    <style>
        table, th, td {
        border:1px solid black;
        }
    </style>
    <body>
        <h2>A basic HTML table</h2>
        <table style="width:100%">
            <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Country</th>
            </tr>
            <tr>
                <td>Alfreds Futterkiste</td>
                <td>Maria Anders</td>
                <td>Germany</td>
            </tr>
        </table>
        <p>To undestand the example better, we have added borders to the table.</p>
    </body>
</html>
`;
var server = http.createServer(function(req, res){
 res.writeHead(200, {'Content-Type':'text/html'})
 res.end(htmlContent);
});
console.log('Server is running on port 3000');
server.listen(3000,'0.0.0.0');