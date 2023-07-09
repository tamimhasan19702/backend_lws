/**
 * title:check handler function
 * description: checks the function can handle the upmonitoring system or not
 *  @format
 */

//dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");

//module scaffholding

const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

//extra scaffholding for checks
handler._check = {};


//post method used to handle new check
handler._check.post = (requestProperties, callback) => {
  
};

// give response to check handler function
handler._check.get = (requestProperties, callback) => {
 
};

//update the existing check handler response
handler._check.put = (requestProperties, callback) => {
  
};

// deleted the existing check request
handler._check.delete = (requestProperties, callback) => {
  
};

module.exports = handler;
