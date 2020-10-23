module.exports = app => {

    const control = require("./controller");

    app.route('/test').get(control.test);
    app.route('/').get(control.test);

    app.route('/uploadGuide').post(control.uploadGuide);
}