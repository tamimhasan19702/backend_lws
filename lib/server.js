/**
 * *Title: Server library
 * *Description: Server related files
 * *Author: Tareq Monower
 * *this is the primary file for this Api
 * !this is an complete Raw Node Project. there's no framework being used
 *
 * @format
 */

//todo: dependencies
//dependencies
const http = require("http");
const { handleReqRes } = require("../helpers/handleReqRes");

//server object for module scaffholding
const server = {};

//configuration
server.config = {
  port: 5000,
};

//create server
server.createServer = () => {
  const createServerVariable = http.createServer(server.handleReqRes);
  //listening to the server
  createServerVariable.listen(server.config.port, () => {
    console.log(`Listining to port ${server.config.port}`);
  });
};

//handle server request/response
server.handleReqRes = handleReqRes;

//start the server
server.init = () => {
  server.createServer();
};

//exporting the server
module.exports = server;
