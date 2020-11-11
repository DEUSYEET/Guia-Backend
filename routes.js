module.exports = app => {

    const control = require("./controller");

    app.route('/test').get(control.test);
    app.route('/').get(control.test);
    app.route('/getAll').get(control.getAll);
    app.route('/getGuide').get(control.getGuide);
    app.route('/deleteGuide').get(control.deleteGuide);

    app.route('/uploadGuideHead').post(control.uploadGuideHead);
    app.route('/uploadGuideSection').post(control.uploadGuideSection);
    app.route('/uploadImage').post(control.uploadImage);
}