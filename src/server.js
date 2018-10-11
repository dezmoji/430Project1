const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponse.js');
const jsonHandler = require('./jsonResponse.js');


const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  index: htmlHandler.getIndex,
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/addTask': jsonHandler.addTask,
  '/getTasks': jsonHandler.getTasks,
  '/removeTask': jsonHandler.removeTask,
  notFound: jsonHandler.notFound,
};

const onRequest = (request, response) => {
  const URLobj = url.parse(request.url);
  const parsedURL = URLobj.pathname;
  const params = query.parse(URLobj.query);
  if (request.method === 'POST') {
    const res = response;

    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      if (parsedURL === '/addTask') jsonHandler.addTask(request, res, bodyParams);
      if (parsedURL === '/removeTask') jsonHandler.removeTask(request, res, bodyParams);
    });
  } else if (urlStruct[parsedURL]) {
    urlStruct[parsedURL](request, response, params);
  } else {
    urlStruct.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);
