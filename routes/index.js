const express = require('express');
const sequelize = require('../models').sequelize;
const sql = require('../sql');
const router = express.Router();

router.get('/', (req, res) => {
	console.log("root");
	res.render('index');
});

//카카오 서버와 연동.
router.post('/login', (req, res) => {
	console.log("login");
	res.render('mainpage', {title: 'Express', userinfo: null});
});

router.get('/userinfo', (req, res) => {
	console.log("userinfo");
	//sql.getUserInfo
	var userinfo = {id : 0, app_user_id : 1, nickname : "kkk", access_token : "asdf1234", refresh_token : "aaaa1111", created_at : "20200103"};
	res.render('mainpage', {title: 'Express', userinfo: userinfo});
});

router.post('/logout', (req, res) => {
	console.log("logout");
	res.redirect('/');
	//TODO : webbrowser 닫기
});

router.post('/leave', (req, res) => {
	console.log("leave");
	res.redirect('/');
});

router.get('/log', (req, res) => {
	console.log("log");
	/* TODO
		const logs = await sql.getAllLogs();
		res.render('logview', {logs: logs});
	*/
	var logs = [];
	for (var i = 0; i < 5; i++) {
		const log = {is_req : true, header : "헤더"+i, body : "바디"+i};
		logs.push(log);
	}
	res.render('logview', {logs: logs});
});

router.post('/log/search', async (req, res) => {
	 var paramSearchContent = req.body.search_content || req.query.search_content;
	console.log("log search : " + paramSearchContent);
	if (paramSearchContent === undefined) {
		const logs = await sql.getAllLogs();
		res.render('logview', {logs: logs});
	} else {
		const logs = await sql.getLogs(paramSearchContent);
		res.render('logview', {logs: logs});
	}
});

module.exports = router;