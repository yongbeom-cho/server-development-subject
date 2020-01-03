const sequelize = require('../models').sequelize;
const Op = require('../models').Sequelize.Op;
const { UserInfo, Log }= require('../models');

function createUserInfo(app_user_id, nickname, access_token, refresh_token) {
	return new Promise(async function(resolve, reject) {
    try {
			 sequelize.trasaction().then(async tx => {
				 console.log('createUserInfo');
				 return UserInfo.create({
					 app_user_id,
					 nickname,
					 access_token,
					 refresh_token,},
					{transaction: tx})
			 .then(async result => {
				 await tx.commit();
			 }).catch(err => {
				 tx.rollback();
				 console.log(err);
				 reject(err);
			 });
			});
    } catch (error) {
      console.log("try inside catch = " + error);
      reject(error);
    }
  });
};

function createLog(is_req, header, body) {
		return new Promise(async function(resolve, reject) {
    try {
			console.log('createLog');
			 sequelize.trasaction().then(async tx => {
				 return Log.create({
					 is_req,
					 header,
					 body,},
					{transaction: tx})
			 .then(async result => {
				 await tx.commit();
			 }).catch(err => {
				 tx.rollback();
				 console.log(err);
				 reject(err);
			 });
			});
    } catch (error) {
      console.log("try inside catch = " + error);
      reject(error);
    }
  });
};

function modifyNickname(app_user_id, new_nickname) {
	var result;
	return new Promise(async function(resolve, reject) {
    try {
			console.log('modifyNickname');
      sequelize.transaction().then(async tx => {
				/* Update function of sequelize returns a number of affected rows (first parameter of result array).
					 You should call find to get updated row
				 */
        return RoomCoinInfo.update({nickname: new_nickname}, {where: {app_user_id: app_user_id}, transaction: tx})
        .then(async (updatedRowCount) => {
					console.log("updateRowCount : " + updatedRowCount);
					tx.commit();
        }).catch(error => {
          console.log("promise inside catch = " + error);
          tx.rollback();
          reject(error);
        });
      });
    } catch (error) {
      console.log("try inside catch = " + error);
      reject(error);
    }
  });
};

function deleteUserInfo(app_user_id) {
	return new Promise(async function(resolve, reject) {
    try {
			console.log('deleteUserInfo');
			 sequelize.trasaction().then(async tx => {
				 return UserInfo.destroy({
						 where: {
								app_user_id: app_user_id
						 }
					}).then((deletedRowCount) => { // rowDeleted will return number of rows deleted
					  tx.commit();
						if (deletedRowCount === 1) {
							console.log('Deleted successfully');			 
						} else {
							 console.log('Deleted more than one');
						}
					}).catch(err => {
						 tx.rollback();
						 console.log(err);
						 reject(err);
					});
			});
    } catch (error) {
      console.log("try inside catch = " + error);
      reject(error);
    }
 });
};

async function getUserInfo(app_user_id) {
  var id, nickname, access_token, refresh_token, created_at;
  try {
     const userInfo= await UserInfo.findOne({ where: { app_user_id : app_user_id} });
		 console.log('getUserInfo userInfo : ' + userInfo);
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

async function getUsers() {
  try {
     const users= await UserInfo.findAll();
		console.log('getUsers users : ' + users);
     return users;
  } catch (error) {
   console.error(error);
   return null;
 }
}

async function getUserInfosFromNickname(nickname) {
  try {
     const users= await UserInfo.findAll({ where: { nickname : nickname} });
		console.log('getUserInfosFromNickname users : ' + users);
     return users;
  } catch (error) {
   console.error(error);
   return null;
 }
}

async function getAllLogs() {
		try {
     const logs = await Log.findAll();
		 console.log('getLogs logs : ' + JSON.stringify(logs));
     return logs;
  } catch (error) {
   console.error(error);
   return null;
 }
}

async function getLogs(search_content) {
	  try {
     const logs = await Log.findAll({
			 where:{
				 [Op.or]: [
					 {
						 header: {
							 [Op.like]: "%" + search_content + "%"
						 }
					 },
					 {
						 body: {
							 [Op.like]: "%" + search_content+ "%"
						 }
					 }
				 ]
			 }
		 });
		 console.log('getLogs logs : ' + JSON.stringify(logs));
     return logs;
  } catch (error) {
   console.error(error);
   return null;
 }
}

exports.createUserInfo = createUserInfo;
exports.createLog = createLog;
exports.modifyNickname = modifyNickname;
exports.deleteUserInfo = deleteUserInfo;

exports.getUserInfo = getUserInfo;
exports.getUsers = getUsers;
exports.getUserInfosFromNickname = getUserInfosFromNickname;
exports.getAllLogs = getAllLogs;
exports.getLogs = getLogs;