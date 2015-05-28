var connect = require('connect');
var app = connect()
    .use(connect.static('./'))
    .use(connect.directory('./'));

require('http')
    .createServer(app)
    .listen(9000)
    .on('listening', function () {
        console.log('Started connect web server on http://localhost:9000');
    });
