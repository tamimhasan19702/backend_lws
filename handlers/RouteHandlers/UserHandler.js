/**
 * title: user Handler function
 * description: Route handler to handler user related routes
 * @format
 */

//module scaffholding

const handler = {};

handler.userHandler = (requestProperties, callback) => {

  
  callback(200, {
    message: "This is a user Message!!",
  });
};

module.exports = handler;
