/**
 * title: Defaut Not Found handler (404)
 */

//module scaffholding

const handler = {};

handler.NotfoundHandler = (requestProperties,callback) => {
    console.log(requestProperties);
    callback(404,{
        message: 'Your Requested URL was not Found'
    } )
}

module.exports = handler;