/**
 * title: user Handler function
 * description: Route handler to handler user related routes
 * @format
 */

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

const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : null;

const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : null;

const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : null;

const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : null;

const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'boolean' && requestProperties.body.tosAgreement.trim().length > 0 ? requestProperties.body.tosAgreement : null;


if(firstName && lastName && phone && password && tosAgreement){
//making sure that if user exist or not

}else{
  callback(400, {
    message: 'You have problem in your request'
  })
}


};

handler._users.get = (requestProperties, callback) => {
  callback(200)
};

handler._users.put = (requestProperties, callback) => {};

handler._users.delete = (requestProperties, callback) => {};

module.exports = handler;
