/**
 * title: sample Handler function
 *
 * @format
 */

//module scaffholding

const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  console.log(requestProperties);

  callback(200, {
    message: "This is a Sample Message!!",
  });
};

module.exports = handler;
