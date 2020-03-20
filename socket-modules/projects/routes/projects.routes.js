const eventHandlerNames = require('../events/events.socket');

module.exports = (io) => {
    const projectRoutes = io.of('/projects');

    projectRoutes.on('connection', (socket) => eventHandlerNames(projectRoutes, socket));
}