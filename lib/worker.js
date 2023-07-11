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
    if(!outcomeSent){
        worker.processCheckOutCome(originalCheckData, checkOutCome);
        outcomeSent = true;
    }

  });

  //check error
  req.on('error', (e) => {

    checkOutCome = {
        error: true,
        value: e,
      };

    //update the check outcome and pass to the next process
    if(!outcomeSent){
        worker.processCheckOutCome(originalCheckData, checkOutCome);
        outcomeSent = true;
    }
  });

  //check timeout
  req.on('timeout', () => {
    checkOutCome = {
        error: true,
        value: timeout,
      };

    //update the check outcome and pass to the next process
    if(!outcomeSent){
        worker.processCheckOutCome(originalCheckData, checkOutCome);
        outcomeSent = true;
    }
  })

  //req send
  req.end();
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
  }, 1000 * 60);
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
