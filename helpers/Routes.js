/**
 * title: Routes
 * description: this file is for provide routing in my API
 * Author: Tareq
 * Date: 26/6/2023
 */

//dependencies
const {sampleHandler} = require('../handlers/RouteHandlers/SampleHandler')

const routes = {
    'sample': sampleHandler
}

module.exports = routes;