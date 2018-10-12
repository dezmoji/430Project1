const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponse.js');
const jsonHandler = require('./jsonResponse.js');


const port = process.env.PORT || process.env.NODE_PORT || 3000;

// struct for url paths
const urlStruct = {
  index: htmlHandler.getIndex,
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/addTask': jsonHandler.addTask,
  '/getTasks': jsonHandler.getTasks,
  '/removeTask': jsonHandler.removeTask,
  notFound: jsonHandler.notFound,
};

// method to handle requests from client
const onRequest = (request, response) => {
  // parse the request url into a pathname and params
  const URLobj = url.parse(request.url);
  const parsedURL = URLobj.pathname;
  const params = query.parse(URLobj.query);

  // if the request is a POST
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
      // parse the body
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      if (parsedURL === '/addTask') jsonHandler.addTask(request, res, bodyParams);
      if (parsedURL === '/removeTask') jsonHandler.removeTask(request, res, bodyParams);
    });
  } else if (urlStruct[parsedURL]) {
    // otherwise, use the path to call the correct method
    urlStruct[parsedURL](request, response, params);
  } else {
    // call this is pathname is passed in that is not in the struct
    urlStruct.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);
