const express = require('express');
const sequelize = require('../models').sequelize;
const sql = require('../sql');
const request = require("request");
const router = express.Router();
const { RESTAPI_KEY } = process.env;

router.get('/', (req, res) => {
	const link = "https://kauth.kakao.com/oauth/authorize?client_id="+RESTAPI_KEY+"&redirect_uri=http://localhost:8080/callback&response_type=code";
	res.render('index', { link : link });
});

router.get('/callback', (req, res) => {
	const { code } = req.query;
	console.log("callback, code : " + code);
	const options = {
        grant_type: "authorization_code",
        client_id: RESTAPI_KEY,
        redirect_uri: "http://localhost:8080/callback",
        code: code
  };
	
	request.post("https://kauth.kakao.com/oauth/token", { form : options }, (error, response, body) => {
		const json_body = JSON.parse(body);
		const access_token = json_body.access_token;
		const refresh_token = json_body.refresh_token;
		console.log("access token : " + access_token);
		
		const me_options = {
			url: 'https://kapi.kakao.com/v2/user/me',
			headers: {
				'Authorization': " Bearer " + access_token,
				'content-type': 'application/x-www-form-urlencoded',
			}
		};
		request.get(me_options, async (error, response, body) => {
			console.log("v2/user/me 정보 ");
			console.log(body);
			const user_info = JSON.parse(body);
			const app_user_id = user_info.id;
			const nickname = user_info.properties.nickname;
			try {
				await sql.mergeUserInfo(app_user_id, nickname, access_token, refresh_token);
				const userinfo = await sql.getUserInfo(app_user_id);
				res.render('mainpage', {userinfo: userinfo});
			} catch (error) {
				console.log("createUserInfo or getUserInfo Failed");
				res.redirect('/');
			}
		});
  });
});

//탈퇴하기
router.post('/leave', (req, res) => {
	console.log("leave");
	var access_token = req.body.access_token || req.query.access_token;
	const options = {
		url: 'https://kapi.kakao.com/v1/user/unlink',
		headers: {
			'Authorization': " Bearer " + access_token,
			'content-type': 'application/x-www-form-urlencoded',
		}
	};
	request.post(options, async (error, response, body) => {
		console.log("v1/user/unlink 정보 ");
		console.log(body);
		const json_body = JSON.parse(body);
		const app_user_id = json_body.id;
		
		try {
			await sql.deleteUserInfo(app_user_id);
			console.log("deleteUserInfo Success, app_user_id : "+app_user_id);
		} catch (error) {
			console.log("deleteUserInfo Failed, app_user_id : "+app_user_id);
		}
		res.redirect('/');
	});
});

router.post('/logout', (req, res) => {
	console.log("logout");
	var access_token = req.body.access_token || req.query.access_token;
	const options = {
		url: 'https://kapi.kakao.com/v1/user/logout',
		headers: {
			'Authorization': " Bearer " + access_token,
			'content-type': 'application/x-www-form-urlencoded',
		}
	};
	request.post(options, async (error, response, body) => {
		console.log("v1/user/logout 정보 ");
		console.log(body);
		const app_user_id = body.id;
		res.render('close', {close: true});
	});
});

router.get('/log', async (req, res) => {
	console.log("log");
	const logs = await sql.getAllLogs();
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


/*
router.get('/userinfo', (req, res) => {
	console.log("userinfo");
	const { app_user_id } = req.query;
	const userinfo = sql.getUserInfo(app_user_id);	
	res.render('mainpage', {userinfo: userinfo});
});
*/
