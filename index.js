/**
 * *Title: Project initial file
 * *Description: Initial file to start the server and the workers
 * *Author: Tareq Monower
 *
 * *this is the primary file for this Api
 * !this is an complete Raw Node Project. there's no framework being used
 *
 * @format
 */

//todo: dependencies
//dependencies

const server = require("./lib/server");
const worker = require("./lib/worker");

//app object for module scaffholding
const app = {};

app.init = () => {
  //start the server
  server.init();
  //start the worker
  worker.init();
};

app.init();

//export the app
module.exports = app;
