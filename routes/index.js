var util = require('../middleware/utilities'),
        config = require('../config');

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.mainPage = mainPage;
module.exports.queryUserInfo = queryUserInfo;
module.exports.leave = leave;
module.exports.logOut = logOut;

function loginPage(req, res) {
        res.render('login', {title: 'Login', message: req.flash('error')});
};

function login(req, res) {
        var isAuth = util.auth(req.body.username, req.body.password, req.session);
        if (isAuth) {
                res.redirect('/chat');
        } else {
                req.flash('error', 'Wrong Username or Password');
                res.redirect(config.routes.login);
        }
};

function mainPage(req, res) {

};

function queryUserInfo(req, res) {

};

function leave(req, res) {

};

function logOut(req, res){
        util.logOut(req.session);
        res.redirect('/');
};
