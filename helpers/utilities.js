/**
 * title: utilities
 * description: Important utility functions
 * Author : tareq
 */
//dependencies
const crypto = require('crypto');
const environments = require('./environments');

//module scaffholding

const utilities = {};

//parse JSON string to object
utilities.parseJSON = (jsonString) => {
    let output ;

    try{
     output = JSON.parse(jsonString);
    }catch{
      output = {};
    }

    return output;
}

//hashing the user password
utilities.hash = (str) => {
    if(typeof(str) === 'string' && str.length > 0){
      let hash = crypto
      .createHmac('SHA256', environments.secretKey)
      .update(str)
      .digest('hex');
      return hash;
    }
    return false;
}


//create random string
utilities.createRandomString = (strlength) => {
 
  return 'ahsaahjsha';
}

// export module
module.exports = utilities;