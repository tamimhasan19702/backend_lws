/**
 * title: Routes
 * description: this file is for provide routing in my API
 * Author: Tareq
 * Date: 26/6/2023
 *
 * @format
 */

//dependencies
const { sampleHandler } = require("./handlers/RouteHandlers/SampleHandler");
const { userHandler } = require("./handlers/RouteHandlers/UserHandler");
const { tokenHandler } = require("./handlers/RouteHandlers/tokenHandler");
const { checkHandler } = require("./handlers/RouteHandlers/checkHandler");


const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
  check: checkHandler
};

module.exports = routes;
