const app = require('./app');
const http = require('http');
const port = process.env.PORT|| 4000;
const host = process.env.HOST||'0.0.0.0';

const server = http.createServer(app);

// eslint-disable-next-line no-unused-vars
server.listen(port,host,(req,res) => {
	console.log('Server '+host+' running on port:'+port);
});