let http = require("http");
let url = require("url");
let StringDecoder = require("string_decoder").StringDecoder;

let server = http.createServer(function (req, res) {
    // parse the passed url
    let parsedUrl = url.parse(req.url, true);

    // extract the path
    let path = parsedUrl.pathname;
    // strips the '/' from url
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get the query string as an object
    let queryStringObject = parsedUrl.query;

    // get the HTTP method
    let method = req.method.toLowerCase();

    // get headers
    let headers = req.headers;

    // Get the  payload, if any
    let decoder = new StringDecoder('utf8');
    let buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        buffer += decoder.end();

        // choose the handler this request should go;
        // fallback to notFound handler
        let chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // construct the data objec to tsend to the handler
        let data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        // route the request to the handler specified in the router
        chosenHandler(data, function (statusCode, payload) {
            // use the statuscode called back by the handler or default to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // use the payload called back by the handler, or default to an empty object.
            payload = typeof (payload) == 'object' ? payload : {};

            // convert the payload to a string
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
                "\nPayload:", buffer);
        });
    });
});

server.listen(3000, function () {
    console.log("The server is listenting on port 3000");
});

// define the handler
let handlers = {};

// sample handler
handlers.sample = function (data, callback) {
    // callback a http status code and a payload object
    callback(406, {
        'name': 'sample handler'
    });
};

handlers.notFound = function (data, callback) {
    callback(404);
};

// define a request router
let router = {
    'sample': handlers.sample
}