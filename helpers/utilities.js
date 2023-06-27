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
      .createHmac('shah256', environments[process.env.NODE_ENV].secretKey)
      .update(str)
      .digest('hex');
      return hash;
    }
    return false;
}

// export module
module.exports = utilities;