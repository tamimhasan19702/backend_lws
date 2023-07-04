/**
 * title: utilities
 * description: Important utility functions
 * Author : tareq
 *
 * @format
 */

//dependencies
const crypto = require("crypto");
const environments = require("./environments");

//module scaffholding

const utilities = {};

//parse JSON string to object
utilities.parseJSON = (jsonString) => {
  let output;

  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }

  return output;
};

//hashing the user password
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    let hash = crypto
      .createHmac("SHA256", environments.secretKey)
      .update(str)
      .digest("hex");
    return hash;
  }
  return false;
};

//create random string
utilities.createRandomString = (strlength) => {
  let length = strlength;
  length = typeof strlength === "number" && strlength > 0 ? strlength : false;

  if (length) {
    let possibleCharacters = "abcdefghijklmnopqrstuvwxyz1234567890";
    let output = "";
    for (let i = 1; i <= length; i + 1) {
      let randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
    }
    output += randomCharacter;
  }
  return false;
};

// export module
module.exports = utilities;
