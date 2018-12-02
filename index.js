const http = require('http');
const https = require('https');
const url = require('url');
const {
  StringDecoder,
} = require('string_decoder');
const fs = require('fs');
const config = require('./config');

// TODO: We are using RequireJS, can we use ES6's 'import' statement?
// also need to refactor the export statements when doing..

// define the handler
const handlers = {};

// sample handler
handlers.sample = (data, callback) => {
  // callback a http status code and a payload object
  callback(406, {
    name: 'sample handler',
  });
};

handlers.notFound = (data, callback) => {
  callback(404);
};

// define a request router
const router = {
  sample: handlers.sample,
};

// Handle both HTTP and HTTPS
const unifiedServer = (req, res) => {
  // parses the passed url
  const parsedUrl = url.parse(req.url, true);

  // extracts the path
  const path = parsedUrl.pathname;
  // strips the '/' from url
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // gets the query string as an object
  const queryStringObject = parsedUrl.query;

  // gets the HTTP method
  const method = req.method.toLowerCase();

  // gets headers
  const {
    headers,
  } = req;

  // gets the payload, if any
  const decoder = new StringDecoder('utf8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    // choose the handler this request should go;
    // fallback to notFound handler
    const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // construct the data objec to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer,
    };

    // routes the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // uses the statuscode called back by the handler or defaults to 200
      const localStatusCode = typeof (statusCode) === 'number' ? statusCode : 200;

      // uses the payload called back by the handler, or default to an empty object.
      const localPayload = typeof (payload) === 'object' ? payload : {};

      // converts the payload to a string
      const payloadString = JSON.stringify(localPayload);

      // return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(localStatusCode);
      res.end(payloadString);

      // spit out what client asked for
      console.log('Method:', method,
        '\nPath:', trimmedPath,
        '\nHeaders:', headers,
        '\nQuery:', queryStringObject,
        '\nPayload:', buffer,
        '\n=============');
    });
  });
};

// instantiates the HTTP server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// start listening on the http server
httpServer.listen(config.httpPort, () => {
  console.log(`The server is listenting on port ${config.httpPort} in ${config.envName} mode.`);
});

// instantiates the HTTPS server
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

// start listening on the HTTPS server
httpsServer.listen(config.httpsPort, () => {
  console.log(`The server is listenting on port ${config.httpsPort} in ${config.envName} mode.`);
});
