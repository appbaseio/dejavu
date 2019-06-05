/**
 * Custom server used for docker image to serve the static files.
 */
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const port = 1358;
const mimeType = {
	'.ico': 'image/x-icon',
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.json': 'application/json',
	'.css': 'text/css',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.wav': 'audio/wav',
	'.mp3': 'audio/mpeg',
	'.svg': 'image/svg+xml',
	'.pdf': 'application/pdf',
	'.doc': 'application/msword',
	'.eot': 'appliaction/vnd.ms-fontobject',
	'.ttf': 'aplication/font-sfnt',
};

http.createServer((req, res) => {
	console.log(`${req.method} ${req.url}`);

	// parse URL
	const parsedUrl = url.parse(req.url);

	const sanitizePath = path
		.normalize(parsedUrl.pathname)
		.replace(/^(\.\.[\/\\])+/, ''); // eslint-disable-line
	let pathname = path.join(`${__dirname}/dist/app`, sanitizePath);
	const appRoutes = ['/browse', '/query', '/preview'];

	fs.exists(pathname, exist => {
		let checkPath = true;
		if (appRoutes.indexOf(parsedUrl.pathname) > -1) {
			pathname = `${__dirname}/dist/app/index.html`;
			checkPath = false;
		}
		if (!exist && checkPath) {
			// if the file is not found, return 404
			res.statusCode = 404;
			res.end(`File ${pathname} not found!`);
			return;
		}

		// if is a directory, then look for index.html
		if (fs.statSync(pathname).isDirectory()) {
			pathname += '/index.html';
		}

		// read file from file system
		fs.readFile(pathname, (err, data) => {
			if (err) {
				res.statusCode = 500;
				res.end(`Error getting the file: ${err}.`);
			} else {
				const { ext } = path.parse(pathname);
				res.setHeader('Content-type', mimeType[ext] || 'text/plain');
				res.end(data);
			}
		});
	});
}).listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
