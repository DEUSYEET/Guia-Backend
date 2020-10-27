module.exports = app => {

    const control = require("./controller");

    app.route('/test').get(control.test);
    app.route('/').get(control.test);
    app.route('/getAll').get(control.getAll);

    app.route('/uploadGuide').post(control.uploadGuide);
}