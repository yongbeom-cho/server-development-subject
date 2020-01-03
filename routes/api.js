const express = require('express');
const sequelize = require('../models').sequelize;
const sql = require('../sql');
const router = express.Router();

//json object

//appUserId는 회원 정보 테이블의 app_user_id 값
//GET /api/user/{appUserId}
router.get('/api/user/:app_user_id', async (req, res) => {
	const app_user_id = req.params.app_user_id;
	console.log('get /api/user/:app_user_id = ' + app_user_id);
	const userinfo = await sql.getUserInfo(app_user_id);
	res.json(userinfo);
});




//PUT /api/user/{appUserId}, 데이터베이스에 저장된 nickname만 변경
/*
$.ajax({
    url : 'http://localhost:8000/test',
    method : 'post',
    data : {
        nickname : 'test'
    },
    success : function (data) {
        console.log(data);
    },
    error : function (err) {
        console.log(err.toString());
    }
});
*/
router.put('/api/user/:app_user_id', (req, res) => {
	var result;
	const app_user_id = req.params.app_user_id;
	const nickname = req.body.nickname;
	console.log('put nickname /api/user/:app_user_id = ' + app_user_id);
	
	sql.modifyNickname(app_user_id, nickname)
	.then(() => {
		result = {'success' : true};
		res.json(result);
	}).catch(err => {
		console.log(err);
		result = {'success' : false};
		res.json(result);
	})
});



//DELETE /api/user/{appUserId}
router.delete('/api/user/:app_user_id', (req, res) => {
	var result;
	const app_user_id = req.params.app_user_id;
	console.log('delete nickname /api/user/:app_user_id = ' + app_user_id);
	
	sql.deleteUserInfo(app_user_id)
	.then(() => {
		result = {'success' : true};
		res.json(result);
	}).catch(err => {
		console.log(err);
		result = {'success' : false};
		res.json(result);
	})
});




router.get('/api/users', async (req, res) => {
	const nickname = req.query.nickname;
	var userinfos;
	if (nickname === undefined) {
		//전체회원 : GET /api/users
		userinfos = await sql.getUserInfos();
	} else {
		//특정회원검색 : GET /api/users?nickname=XXXX
		userinfos = await sql.getUserInfosFromNickname(nickname);
	}
	res.json(userinfos);
});

module.exports = router;