/**
 * title:check handler function
 * description: checks the function can handle the upmonitoring system or not
 *  @format
 */

//dependencies
const data = require("../../lib/data");
const { parseJSON, createRandomString } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");
const { maxChecks } = require("../../helpers/environments");

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
  //validate inputs

  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  const successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  const timeOutSeconds =
    typeof requestProperties.body.timeOutSeconds === "number" &&
    requestProperties.body.timeOutSeconds % 1 === 0 &&
    requestProperties.body.timeOutSeconds >= 1 &&
    requestProperties.body.timeOutSeconds <= 5
      ? requestProperties.body.successCodes
      : false;

  if (protocol && url && method && successCodes && timeOutSeconds) {
    //verify token
    const token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;

    // lookup the user phone using this token
    data.read("tokens", token, (err1, tokenData) => {
      if (!err1 && tokenData) {
        let userPhone = parseJSON(tokenData).phone;
        //lookup the user data
        data.read("users", userPhone, (err2, userData) => {
          if (!err2 && userData) {
            tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                let userObject = parseJSON(userData);

                let userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (userChecks.length <= maxChecks) {
                  const checkId = createRandomString(20);

                  const checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeOutSeconds,
                  };
                  // save the object to the database
                  data.create("checks", checkId, checkObject, (err3) => {
                    if (!err3) {
                      // adding check id to the userObject
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);

                      //save the new user data

                      data.update("users", userPhone, userObject, (err4) => {
                        //return the data about the new check
                        callback(200, checkObject);
                      });
                    } else {
                      callback(500, {
                        error: "There was a problem in the server side!",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    error: "User has already reached max check limit!",
                  });
                }
              } else {
                callback(403, {
                  error: "Authentication error!",
                });
              }
            });
          } else {
            callback(403, {
              error: "User not found!",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication error!",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request!",
    });
  }
};

// give response to check handler function
handler._check.get = (requestProperties, callback) => {
  // check the id if valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    //look up the check
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        const token =
          typeof requestProperties.headerObject.token === "string"
            ? requestProperties.headerObject.token
            : false;

        tokenHandler._token.verify(
          token,
          parseJSON(checkData).userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              callback(200, parseJSON(checkData));
            } else {
              callback(403, {
                error: "Authentication failure!",
              });
            }
          }
        );
      } else {
        callback(500, {
          error: "You have a problem in your request!",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request!",
    });
  }
};

//update the existing check handler response
handler._check.put = (requestProperties, callback) => {
  //input validation

  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  const successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  const timeOutSeconds =
    typeof requestProperties.body.timeOutSeconds === "number" &&
    requestProperties.body.timeOutSeconds % 1 === 0 &&
    requestProperties.body.timeOutSeconds >= 1 &&
    requestProperties.body.timeOutSeconds <= 5
      ? requestProperties.body.successCodes
      : false;

  if (id) {
    if (protocol || url || method || successCodes || timeOutSeconds) {
      data.read("checks", id, (err1, checkData) => {
        if (!err1 && checkData) {
          let checkObject = parseJSON(checkData);

          const token =
            typeof requestProperties.headerObject.token === "string"
              ? requestProperties.headerObject.token
              : false;

          tokenHandler._token.verify(
            token,
            checkObject.userPhone,
            (tokenIsValid) => {
              if (tokenIsValid) {
                if (protocol) {
                  checkObject.protocol = protocol;
                }
                if (url) {
                  checkObject.url = url;
                }
                if (method) {
                  checkObject.method = method;
                }
                if (successCodes) {
                  checkObject.successCodes = successCodes;
                }
                if (timeOutSeconds) {
                  checkObject.timeOutSeconds = timeOutSeconds;
                }

                //store the checkout Object
                data.update("checks", id, checkObject, (err2) => {
                  if (!err2) {
                    callback(200, {
                      message: "Successfully updated",
                    });
                  } else {
                    callback(500, {
                      error: "There was a server side error!",
                    });
                  }
                });
              } else {
                callback(403, {
                  error: "Authorization error",
                });
              }
            }
          );
        } else {
          callback(500, {
            error: "There was a problem in the server side!",
          });
        }
      });
    } else {
      callback(400, {
        error: "You must provide at least one field to update!",
      });
    }
  } else {
    callback(400, {
      error: "You have a problem in your request!",
    });
  }
};

// deleted the existing check request
handler._check.delete = (requestProperties, callback) => {
  // check the id if valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    //look up the check
    data.read("checks", id, (err1, checkData) => {
      if (!err1 && checkData) {
        const token =
          typeof requestProperties.headerObject.token === "string"
            ? requestProperties.headerObject.token
            : false;

        tokenHandler._token.verify(
          token,
          parseJSON(checkData).userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              //delete the check data
              data.delete("checks", id, (err2) => {
                if (!err2) {

                  data.read(
                    "users",
                    parseJSON(checkData).userPhone,
                    (err3, userData) => {

                      let userObject = parseJSON(userData);
                      if (!err3 && userData) {
                        let userChecks =
                          typeof userObject.checks === "object" &&
                          userObject.checks instanceof Array
                            ? userObject.checks
                            : [];


                      //remove the deleted check id from the user's list of checks
                      




                      } else {
                        callback(500, {
                          error: "There was a server side problem!",
                        });
                      }
                    }
                  );
                } else {
                  callback(500, {
                    error: "There was a server side problem!",
                  });
                }
              });
            } else {
              callback(403, {
                error: "Authentication failure!",
              });
            }
          }
        );
      } else {
        callback(500, {
          error: "You have a problem in your request!",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request!",
    });
  }
};

module.exports = handler;
