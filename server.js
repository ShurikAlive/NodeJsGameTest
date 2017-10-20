var PORT = process.env.PORT || 5000;

var http = require('http');

var server = http.createServer(function (req, res) {
    res.end('Hello Http');
});

server.listen(PORT);