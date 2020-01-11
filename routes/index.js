const express = require('express');
const sql = require('../sql');
const request = require("request");
const router = express.Router();
const { RESTAPI_KEY } = process.env;
const link = "https://kauth.kakao.com/oauth/authorize?client_id="+RESTAPI_KEY+"&redirect_uri=http://localhost:8080/callback&response_type=code";

router.get('/', (req, res) => {
	res.render('index', function(err, html) {
		res.end(html);
	});
});

router.get('/login', (req, res) => {
	res.render('login', { link : link }, function(err, html) {
		res.end(html);
	});
});

router.get('/callback', (req, res) => {
	const { code } = req.query;
	const options = {
		grant_type: "authorization_code",
		client_id: RESTAPI_KEY,
		redirect_uri: "http://localhost:8080/callback",
		code: code
	};
	
	request.post("https://kauth.kakao.com/oauth/token", { form : options }, (error, response, body) => {
		if (error) {
			res.status(500).send(error);
		}
		const json_body = JSON.parse(body);
		const access_token = json_body.access_token;
		const refresh_token = json_body.refresh_token;
		
		const me_options = {
			url: 'https://kapi.kakao.com/v2/user/me',
			headers: {
				'Authorization': " Bearer " + access_token,
				'content-type': 'application/x-www-form-urlencoded',
			}
		};
		request.get(me_options, async (error, response, body) => {
			if (error) {
				res.status(500).send(error);
			}
			const user_info = JSON.parse(body);
			const app_user_id = user_info.id;
			const nickname = user_info.properties.nickname;
			try {
				await sql.mergeUserInfo(app_user_id, nickname, access_token, refresh_token);
				const userinfo = await sql.getUserInfo(app_user_id);
				res.render('mainpage', {userinfo: userinfo, show_userinfo: false}, function(err, html) {
                    res.end(html);
                });
			} catch (error) {
                res.status(500).send(error);
			}
		});
	});
});

//탈퇴하기
router.post('/leave', (req, res) => {
	var access_token = req.body.access_token || req.query.access_token;
	const options = {
		url: 'https://kapi.kakao.com/v1/user/unlink',
		headers: {
			'Authorization': " Bearer " + access_token,
			'content-type': 'application/x-www-form-urlencoded',
		}
	};
	request.post(options, async (error, response, body) => {
		if (error) {
			res.status(500).send(error);
		}
		const json_body = JSON.parse(body);
		const app_user_id = json_body.id;
		
		try {
			await sql.deleteUserInfo(app_user_id);
			res.render('login', { link : link }, function(err, html) {
				res.end(html);
			});
		} catch (error) {
            res.status(500).send(error);
		}		
	});
});

router.post('/logout', (req, res) => {
	var access_token = req.body.access_token || req.query.access_token;
	const options = {
		url: 'https://kapi.kakao.com/v1/user/logout',
		headers: {
			'Authorization': " Bearer " + access_token,
			'content-type': 'application/x-www-form-urlencoded',
		}
	};
	request.post(options, async (error, response, body) => {
		if (error) {
			res.status(500).send(error);
		}
		res.render('close', function(err, html) {
			res.end(html);
		});
	});
});

router.get('/log', async (req, res) => {
	try {
        const logs = await sql.getAllLogs();
        res.render('logview', {logs: logs}, function(err, html) {
            res.end(html);
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/log/search', async (req, res) => {
	var paramSearchContent = req.body.search_content || req.query.search_content;
	try {
		if (paramSearchContent === undefined) {
			const logs = await sql.getAllLogs();
			res.render('logview', {logs: logs}, function(err, html) {
				res.end(html);
			});
		} else {
			const logs = await sql.getLogs(paramSearchContent);
			res.render('logview', {logs: logs}, function(err, html) {
				res.end(html);
			});
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

router.get('/userinfo', async (req, res) => {
	const { app_user_id } = req.query;
	try {
		const userinfo = await sql.getUserInfo(app_user_id);
		res.render('mainpage', {userinfo: userinfo, show_userinfo: true}, function(err, html) {
			res.end(html);
		});
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;





