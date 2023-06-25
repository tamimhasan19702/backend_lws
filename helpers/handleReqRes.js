/**
 * this is a helper function for the database
 * !this does handle request and response
 */

//dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");

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
  
    const decoder = new StringDecoder("utf-8");
    let realData = "";
  
    req.on("data", (buffer) => {
      realData += decoder.write(buffer);
    });
  
    req.on("end", () => {
      realData += decoder.end();
      console.log(realData);
      //response handle
      res.end("Hello world");
    });
  };

  module.exports = handler;