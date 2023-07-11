/**
 * Title: Notification library
 * Description: Important function to notify the users
 * Author: Tareqmonower
 *
 * @format
 */

//dependencies
const https = require("https");
const { twilio } = require("./environments");
const { querystring } = require("querystring");

//module scaffholding
const notification = {};

//send sms to user using twilio api
notification.sendTwilioSms = (phone, msg, callback) => {
  //input validation
  const userPhone =
    typeof phone === "string" && phone.trim().length === 11
      ? phone.trim()
      : false;

  const userMsg =
    typeof msg === "string" && msg.trim().length > 0 && msg.trim() <= 1600
      ? msg.trim()
      : false;

  if (userPhone && userMsg) {
    //configure the request payload
    const payload = {
      From: twilio.fromPhone,
      To: `+88${userPhone}`,
      Body: userMsg,
    };

    //stringify the payload data
    const stringifyPayload = querystring.stringify(payload);

    //configuire  the request details
    const requestDetails = {
      hostName: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
      auth: `${twilio.accountSid}:${twilio.authToken}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    //instantiate the request object
    const req = https.request(requestDetails, (res) => {
      //get the status of the sent request
      const status = res.statusCode;
      //callback successfully if the request went through
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`Status code returned was ${status}`);
      }
    });

    req.on('error', (error) => {
        callback(error);
    })

    req.write(stringifyPayload);
    req.end()

  } else {
    callback("Given parameters were missing or invalid!");
  }
};

module.exports = notification;
