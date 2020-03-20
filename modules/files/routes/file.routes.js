module.exports = (app) => {
    const filesController = require('../controllers/file.controllers');

    app.route('/files/:filesId')
        .get(filesController.download)

    app.param('filesId', filesController.findFileId);
}