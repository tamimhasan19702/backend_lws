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
const data = require('./data');

//worker object for module scaffholding
const worker = {};

//gathering all the checks
worker.gatherAllChecks = () => {
    //get all the checks
}

//timer to execute the worker process once per minute
worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 1000*60 )
}


//start the server
worker.init = () => {

   //execute all the checks
   worker.gatherAllChecks();

   //call the loop for a certain period time to check continue
   worker.loop()

};

//exporting the worker
module.exports = worker;
