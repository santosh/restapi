let http = require("http");
let url = require("url");
let {
    StringDecoder
} = require("string_decoder");
let config = require("./config");

// TODO: We are using RequireJS, can we use ES6's "import" statement?
// also need to refactor the export statements when doing..

let server = http.createServer((req, res) => {
    // parses the passed url
    let parsedUrl = url.parse(req.url, true);

    // extracts the path
    let path = parsedUrl.pathname;
    // strips the '/' from url
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // gets the query string as an object
    let queryStringObject = parsedUrl.query;

    // gets the HTTP method
    let method = req.method.toLowerCase();

    // gets headers
    let headers = req.headers;

    // gets the payload, if any
    let decoder = new StringDecoder('utf8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        // choose the handler this request should go;
        // fallback to notFound handler
        let chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // construct the data objec to send to the handler
        let data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        // routes the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            // uses the statuscode called back by the handler or defaults to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // uses the payload called back by the handler, or default to an empty object.
            payload = typeof (payload) == 'object' ? payload : {};

            // converts the payload to a string
            let payloadString = JSON.stringify(payload);

            // return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // spit out what client asked for 
            console.log("Method:", method,
                "\nPath:", trimmedPath,
                "\nHeaders:", headers,
                "\nQuery:", queryStringObject,
                "\nPayload:", buffer,
                "\n=============");
        });
    });
});

server.listen(config.port, () => {
    console.log(`The server is listenting on port ${config.port} in ${config.envName} mode.`);
});

// define the handler
let handlers = {};

// sample handler
handlers.sample = (data, callback) => {
    // callback a http status code and a payload object
    callback(406, {
        'name': 'sample handler'
    });
};

handlers.notFound = (data, callback) => {
    callback(404);
};

// define a request router
let router = {
    'sample': handlers.sample
}