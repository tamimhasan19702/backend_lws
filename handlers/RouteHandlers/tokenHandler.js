/**
 * title:token Handler function
 * description: Route handler to handler token related routes
 * @format
 */

//dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");

//module scaffholding

const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler.token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

//extra scaffholding for users

handler._token = {};

//post method used to create a new user
handler._token.post = (requestProperties, callback) => {};

// give response as phone number as query string
//todo: authentication must add
handler._token.get = (requestProperties, callback) => {};

//todo: authentication must add
//update the existing user
handler._token.put = (requestProperties, callback) => {};

// deleted user information with this handler
//todo: authentication must add
handler._token.delete = (requestProperties, callback) => {};

module.exports = handler;
