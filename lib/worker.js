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
const {parseJSON } = require('../helpers/utilities')

//worker object for module scaffholding
const worker = {};

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
    
}

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
