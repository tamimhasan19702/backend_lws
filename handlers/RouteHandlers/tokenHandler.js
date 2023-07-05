/**
 * title:token Handler function
 * description: Route handler to handler token related routes
 * @format
 */

//dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { createRandomString } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");

//module scaffholding

const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

//extra scaffholding for users

handler._token = {};

//post method used to create a new user
handler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;
  if (phone && password) {
    data.read("users", phone, (err1, userData) => {
      const hashedpassword = hash(password);
      if (hashedpassword === parseJSON(userData).password) {
        const tokenId = createRandomString(20);
        const expires = Date.now() + 60 * 60 * 1000;
        const tokenObject = {
          phone,
          id: tokenId,
          expires,
        };

        // store the token
        data.create("tokens", tokenId, tokenObject, (err2) => {
          if (!err2) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              error: "There was a problem in the server side!",
            });
          }
        });
      } else {
        callback(400, {
          error: "Password is not valid!",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

// give response as phone number as query string
handler._token.get = (requestProperties, callback) => {
  //check the id is valid or not
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 11
      ? requestProperties.queryStringObject.id
      : null;

  if (id) {
    //look up the token
    data.read("tokens", id, (err, tokenData) => {
      const token = { ...parseJSON(tokenData) };
      //copied token object immutably
      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, {
          error: "Requested token was not found!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested token was not found!",
    });
  }
};

//todo: authentication must add
//update the existing user
handler._token.put = (requestProperties, callback) => {};

// deleted user information with this handler
//todo: authentication must add
handler._token.delete = (requestProperties, callback) => {};

module.exports = handler;
