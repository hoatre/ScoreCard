var connect = require('connect'),
    serveStatic = require('serve-static'),
    port = 9999;

var app = connect();

app.use(serveStatic(__dirname));
app.listen(port);

console.log('Server running at http://localhost:' + port);
