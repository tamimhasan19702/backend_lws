/**
 * title: user Handler function
 * description: Route handler to handler user related routes
 * @format
 */

//dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");

//module scaffholding

const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

//extra scaffholding for users

handler._users = {};

//post method used to create a new user
handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : null;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : null;

  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : null;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : null;

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean" &&
    requestProperties.body.tosAgreement
      ? requestProperties.body.tosAgreement
      : null;

  //making sure that if user exist or not
  if (firstName && lastName && phone && password && tosAgreement) {
    data.read("users", phone, (err1) => {
      if (err1) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        // store the user to database
        data.create("users", phone, userObject, (err2) => {
          if (!err2) {
            callback(200, {
              message: "User was created successfully",
            });
          } else {
            callback(500, { error: "Could not create user!!" });
          }
        });
      } else {
        callback(500, {
          error: "There was a problem in server side",
        });
      }
    });
  } else {
    callback(400, {
      message: "You have problem in your request",
    });
  }
};

// give response as phone number as query string
handler._users.get = (requestProperties, callback) => {
  //check the phone number is valid or not
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : null;

  if (phone) {
    //look up the user
    data.read("users", phone, (err, u) => {
      const user = { ...parseJSON(u) };
      //copied user object immutably
      if (!err && user) {
        delete user.password;
        callback(200, user);
      } else {
        callback(404, {
          error: "Requested user was not found!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested user was not found!",
    });
  }
};

//update the existing user
handler._users.put = (requestProperties, callback) => {
  //check the phone number is valid or not
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : null;

  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : null;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : null;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : null;

  if (phone) {
    if (firstName || lastName || password) {
      //lookup the user
      data.read("users", phone, (err1, uData) => {
        //check the user data
        const userData ={...uData};
        if (!err1 & userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.password = hash(password);
          }

          //store to database
          data.update("users", phone, userData, (err2) => {
            if (!err2) {
              callback(200, {
                message: "User was updates Successfully!",
              });
            } else {
              callback(500, {
                error: "There was a problem in the server side",
              });
            }
          });
        } else {
          callback(400, {
            error: "You have a problem in your request",
          });
        }
      });
    } else {
      callback(400, {
        error: "You have a problem in your request",
      });
    }
  } else {
    callback(400, {
      error: "Invalid phone number. Please try again!",
    });
  }
};

handler._users.delete = (requestProperties, callback) => {};

module.exports = handler;
