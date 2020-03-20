//use process env
require('dotenv').config();

const app = require('./config/lib/express');

const server = app().listen(process.env.PORT || 3031, () => {
    console.log(`Express server has started on port ${process.env.PORT  || 3001}`);
    //init socket routes
    require('./config/lib/socket').initSocket(require('socket.io')(server));
});