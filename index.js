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

        // respond to the request
        res.end("Hello World!\n");

        // spit out what client asked for 
        console.log("Method:", method,
            "\nPath:", trimmedPath,
            "\nHeaders:", headers,
            "\nQuery:", queryStringObject,
            "\nPayload:", buffer);
    });
});



server.listen(3000, function () {
    console.log("The server is listenting on port 3000");
});