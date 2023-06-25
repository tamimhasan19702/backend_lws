/**
 * Title: Uptime monitoring system Api
 * Description: A Restful Api for to monitor up and down time of user defined links
 * Author: Tareq Monower
 * Date: 24/5/2023
 * *this is the primary file for this Api
 * !this is an complete Raw Node Project. there's no framework being used
 *
 * @format
 */

//todo: dependencies
//dependencies
const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");

//app object for module scaffholding
const app = {};

//configuration
app.config = {
  port: 5000,
};

//create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  //listening to the server
  server.listen(app.config.port, () => {
    console.log(`Listining to port ${app.config.port}`);
  });
};

//handle server request/response
app.handleReqRes = (req, res) => {
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

//start the server
app.createServer();
