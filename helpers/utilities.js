/**
 * title: utilities
 * description: Important utility functions
 * Author : tareq
 */

//module scaffholding

const utilities = {}

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

// export module
module.exports = utilities;