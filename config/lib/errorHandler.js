const { logger } = require('./winston');
const createError = require('http-errors');
const moment = require('moment');

/*
*   "errorHadnler" config guide
*
*   step 1. add second parameter "errorHandler" in "routes.js" then add "errorHandler" for routing function 
*   demo) line 1, 34 for project.routes.js
*
*   step 2. use third parameter "next" in inside catch block
*   demo) line 17 for topoDateInfo.controller.js
*/

exports.logErrors = (err, req, res, next) => {
    console.log(err);
    let apiError = err;
    if (err === null) {
        apiError = {};
        apiError.message = 'Not Found';
        apiError.stack = '404 request error';
        apiError.status = 404;
    } else {
        if(!err.status) apiError = createError(err);
    };
    
    logger.error(`${moment().format('YYYY-MM-DD HH:mm:ss')}`, {
        req: {
            headers: req.headers,
            query: req.query,
            body: req.body,
            route: req.route
        },
        error: {
            message: apiError.message,
            stack: apiError.stack,
            status: apiError.status
        },
    });
    
    // res.locals.message = apiError.message;
    // res.locals.error = apiError;
    
    console.log('ERROR STATUS', apiError.status);
    console.log('ERROR STACK', apiError.stack);
    
    return res.status(apiError.status).send(apiError);
}