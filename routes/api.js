const express = require('express');
const sequelize = require('../models').sequelize;
const sql = require('../sql');
const router = express.Router();

//json object

//appUserId는 회원 정보 테이블의 app_user_id 값
//GET /api/user/{appUserId}
router.get('/user/:app_user_id', async (req, res) => {
	const app_user_id = req.params.app_user_id;
	console.log('get /api/user/:app_user_id = ' + app_user_id);
    try {
        const userinfo = await sql.getUserInfo(app_user_id);
        res.json(userinfo);
    } catch(error) {
        res.json(null);
    }
});

router.put('/user/:app_user_id', async (req, res) => {
	var result;
	const app_user_id = req.params.app_user_id;
	const nickname = req.body.nickname;
	console.log('put nickname /api/user/:app_user_id = ' + app_user_id);
	
    try {
        const result = await sql.modifyNickname(app_user_id, nickname);
        res.json(result);
    } catch(error) {
        console.log(error);
        res.json(false);
    }
});

//DELETE /api/user/{appUserId}
router.delete('/user/:app_user_id', async (req, res) => {
	var result;
	const app_user_id = req.params.app_user_id;
	console.log('delete nickname /api/user/:app_user_id = ' + app_user_id);
	
    try {
        const result = await sql.deleteUserInfo(app_user_id);
        res.json(result);
    } catch(error) {
        console.log(error);
        res.json(false);
    }
});

router.get('/users', async (req, res) => {
    console.log("api/users");
	const nickname = req.query.nickname;
	var userinfos;
    try {
        if (nickname === undefined) {
            //전체회원 : GET /api/users
            userinfos = await sql.getUserInfos();
        } else {
            //특정회원검색 : GET /api/users?nickname=XXXX
            userinfos = await sql.getUserInfosFromNickname(nickname);
        }
        res.json(userinfos);
    } catch (error) {
        res.json(null);
    }
});


/* for test */

router.post('/user/:app_user_id', async (req, res) => {
	var result;
	const app_user_id = req.params.app_user_id;
	const nickname = req.body.nickname;
    const access_token = req.body.access_token;
    const refresh_token = req.body.refresh_token;
    
	console.log('create /api/user/:app_user_id = ' + app_user_id);
	
    try {
        const result = await sql.mergeUserInfo(app_user_id, nickname, access_token, refresh_token);
        res.json(result);
    } catch(error) {
        console.log(error);
        res.json(false);
    }
});


module.exports = router;