const sequelize = require('../models').sequelize;
const { UserInfo, Log }= require('../models');

async function getUserInfo(app_user_id) {
  var id, nickname, access_token, refresh_token, created_at;
 try {
     const userInfo= await UserInfo.findOne({ where: { app_user_id : app_user_id} });
     id = userInfo.dataValues.id;
     nickname = userInfo.dataValues.nickname;
     access_token = userInfo.dataValues.access_token;
     refresh_token = userInfo.dataValues.refresh_token;
     created_at = userInfo.dataValues.created_at;
     var info = {id : id, app_user_id : app_user_id, nickname : nickname, access_token : access_token, refresh_token : refresh_token, created_at : created_at};
     return info;
  } catch (error) {
   console.error(error);
   return null;
 }
};
exports.getUserInfo = getUserInfo;

//nickname  변경 api
//modifyNickname(app_user_id, new_nickname)


//deleteUserInfo(app_user_id)


//getUsers

//getUserInfosFromNickname(nickname)
