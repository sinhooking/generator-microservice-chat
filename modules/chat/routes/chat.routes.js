module.exports = (app) => {
    const chatController = require('../controllers/chat.controller');

    app.route('/getChatMsg')
        .get(chatController.read)

    app.route('/chatUpload')
        .post(chatController.create);
}