/**
 * *Title: worker library
 * *Description: wprker related files
 * *Author: Tareq Monower
 * *this is the primary file for this Api
 *
 * @format
 */

//todo: dependencies
//dependencies
const data = require("./data");
const { parseJSON } = require("../helpers/utilities");
const url = require("url");
const http = require("http");
const https = require("https");
const { sendTwilioSms } = require("../helpers/notification");

//worker object for module scaffholding
const worker = {};

//perform check function
worker.performCheck = (originalCheckData) => {
  //preparing the initial check outcome
  let checkOutCome = {
    error: false,
    responseCode: false,
  };

  //mark the outcome has not been sent yet
  let outcomeSent = false;

  //parse the hostname and full url from the original data
  const parseUrl = url.parse(
    `${originalCheckData.protocol}://${originalCheckData.url}`,
    true
  );
  const hostname = parseUrl.hostname;
  const { path } = parseUrl;

  //construct the request
  const requestDetails = {
    protocol: `${originalCheckData.protocol}:`,
    hostname: hostname,
    method: originalCheckData.method.toUpperCase(),
    path,
    timeout: originalCheckData.timeoutSeconds * 1000,
  };

  const protocolToUse = originalCheckData.protocol === "http" ? http : https;

  let req = protocolToUse.request(requestDetails, (res) => {
    //grabing status of the response
    const status = res.statusCode;

    //update the check outcome and pass to the next process
    checkOutCome.responseCode = status;
    if (!outcomeSent) {
      worker.processCheckOutCome(originalCheckData, checkOutCome);
      outcomeSent = true;
    }
  });

  //check error
  req.on("error", (e) => {
    checkOutCome = {
      error: true,
      value: e,
    };

    //update the check outcome and pass to the next process
    if (!outcomeSent) {
      worker.processCheckOutCome(originalCheckData, checkOutCome);
      outcomeSent = true;
    }
  });

  //check timeout
  req.on("timeout", () => {
    checkOutCome = {
      error: true,
      value: timeout,
    };

    //update the check outcome and pass to the next process
    if (!outcomeSent) {
      worker.processCheckOutCome(originalCheckData, checkOutCome);
      outcomeSent = true;
    }
  });

  //req send
  req.end();
};

//save check outcome to database and send to next process
worker.processCheckOutCome = (originalCheckData, checkOutCome) => {
  //check if the check outcome is up or down
  let state =
    !checkOutCome.error &&
    checkOutCome.responseCode &&
    originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1
      ? "up"
      : "down";

  //decide whether we should alert the user or not
  let alertWanted =
    originalCheckData.lastChecked && originalCheckData.state !== state
      ? true
      : false;

  //update the check data
  let newCheckData = originalCheckData;

  newCheckData.state = state;
  newCheckData.lastChecked = Date.now();

  //update the check to disk
  data.update("checks", newCheckData.id, newCheckData, (err) => {
    if (!err) {
      if (alertWanted) {
        //send the checkedData to next process
        worker.alertUserToStatusChange(newCheckData);
      } else {
        console.log("Alert is not needed as there is no state change!");
      }
    } else {
      console.log("Error trying to save check data of one of the checks!");
    }
  });
};

//send notification sms to user if state changes
worker.alertUserToStatusChange = (newCheckData) => {
  const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
    newCheckData.protocol
  }://${newCheckData.url} is currently ${newCheckData.state}`;

  //send message to user
  sendTwilioSms(newCheckData.userPhone, msg, (err) => {
    if (!err) {
      console.log(`User was alerted to a status change via SMS: ${msg}`);
    } else {
      console.log("There was a problem sending sms to one of the user!");
    }
  });
};

//gathering all the checks
worker.gatherAllChecks = () => {
  //get all the checks
  data.list("checks", (err1, checks) => {
    if (!err1 && checks && checks.length > 0) {
      checks.forEach((check) => {
        //read the checkdata
        data.read("checks", check, (err2, originalCheckData) => {
          if (!err2 && originalCheckData) {
            // pass the data to the check validator
            worker.validateCheckData(parseJSON(originalCheckData));
          } else {
            console.log("Error: Error: reading one of the checks data!");
          }
        });
      });
    } else {
      console.log("Error: could not find any checks to process!");
    }
  });
};

//validate the individual check data
worker.validateCheckData = (originalCheckData) => {
  let originalData = originalCheckData;
  if (originalCheckData && originalCheckData.id) {
    originalData.state =
      typeof originalCheckData.state === "string" &&
      ["up", "down"].indexOf(originalCheckData.state) > -1
        ? originalCheckData.state
        : "down";

    originalData.lastChecked =
      typeof originalCheckData.lastChecked === "number" &&
      originalCheckData.lastChecked > 0
        ? originalCheckData.lastChecked
        : false;

    //pass to the next process
    worker.performCheck(originalData);
  } else {
    console.log("Error: check was invalid or not properly formatted!");
  }
};

//timer to execute the worker process once per minute
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllChecks();
  }, 5000);
};

//start the server
worker.init = () => {
  //execute all the checks
  worker.gatherAllChecks();

  //call the loop for a certain period time to check continue
  worker.loop();
};

//exporting the worker
module.exports = worker;
