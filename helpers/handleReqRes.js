/**
 * this is a helper function for the database
 * !this does handle request and response
 *
 * @format
 */

//dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("./Routes");
const {
  NotfoundHandler,
} = require("../handlers/RouteHandlers/NotfoundHandler");

//module scaffholding
const handler = {};

handler.handleReqRes = (req, res) => {
  //request handling

  //get the url and parse it
  const parseUrl = url.parse(req.url, true);
  const path = parseUrl.pathname;
  const trimmedPath = path.replace(/^\/*|\/*$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = parseUrl.query;
  const headerObject = req.headers;

  const requestProperties = {
    parseUrl,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headerObject,
  };

  const decoder = new StringDecoder("utf-8");

  
  //this function handle the handlers and add the statusCode and payload for it
 
  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : NotfoundHandler;

  chosenHandler(requestProperties, (statusCode, payload) => {
   
    statusCode = typeof statusCode === "number" ? statusCode : 500;
   
    payload = typeof payload === "object" ? payload : {};

    const payloadString = JSON.stringify(payload);

    //return the final response
    res.setHeader('content-Type', 'application/json')
    res.writeHead(statusCode);
    res.end(payloadString);
  });

  //request data reference in buffer
  let realData = "";

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  //request data end with the realData
  req.on("end", () => {
    realData += decoder.end();
    console.log(realData);
    //response handle
    res.end("Hello world");
  });
};

module.exports = handler;
