const express = require('express');
const sequelize = require('../models').sequelize;
const { UserInfo, Log }= require('../models');
const router = express.Router();

//json object

//appUserId는 회원 정보 테이블의 app_user_id 값
//GET /api/user/{appUserId}
router.get('/api/user/{appUserId}', isLoggedIn, (req, res) => {

});

//PUT /api/user/{appUserId}, 데이터베이스에 저장된 nickname만 변경
router.put('/api/user/{appUserId}', isLoggedIn, (req, res) => {

});

//DELETE /api/user/{appUserId}
router.delete('/api/user/{appUserId}', isLoggedIn, (req, res) => {

});

//전체회원 : GET /api/users
router.get('/api/users', isLoggedIn, (req, res) => {

});

//특정회원검색 : GET /api/users?nickname=XXXX
router.get('/api/users?nickname=XXXX', isLoggedIn, (req, res) => {

});