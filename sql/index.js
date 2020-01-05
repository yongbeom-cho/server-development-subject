const sequelize = require('../models').sequelize;
const Op = require('../models').Sequelize.Op;
const { UserInfo, Log }= require('../models');

function createUserInfo(app_user_id, nickname, access_token, refresh_token) {
	return sequelize.transaction().then(tx => {
			 console.log('createUserInfo');
			 return UserInfo.create({
				 app_user_id,
				 nickname,
				 access_token,
				 refresh_token,}, 
				{transaction: tx})
		 .then(async result => {
				 tx.commit();
				 console.log('CreateUserInfo Committed');
		 }).catch(err => {
				 tx.rollback();
				 console.log('CreateUserInfo Rollbacked');
				 console.log(err);
				 reject(err);
		 });
		});
};

function updateUserInfo(app_user_id, nickname, access_token, refresh_token) {
	console.log('updateUserInfo');
	return sequelize.transaction().then(tx => {
		return UserInfo.update({nickname: nickname, access_token: access_token, refresh_token: refresh_token}, {where: {app_user_id: app_user_id}, transaction: tx})
			.then(async (updatedRowCount) => {
			console.log("updateRowCount : " + updatedRowCount);
			tx.commit();
		}).catch(error => {
			console.log("promise inside catch = " + error);
			tx.rollback();
			reject(error);
		});
	});
};

function mergeUserInfo(app_user_id, nickname, access_token, refresh_token) {
	return UserInfo.findOne({ where: { app_user_id : app_user_id} })
	.then(obj => {
		if (obj) {
			return updateUserInfo(app_user_id, nickname, access_token, refresh_token);
		} else {
			return createUserInfo(app_user_id, nickname, access_token, refresh_token);
		}
	})
	.catch(error => {
		reject(error);
	});
};

function createLog(type, header, body) {
	console.log('createLog');
	return sequelize.transaction().then(tx => {	
		return Log.create({
			type,
			header,
			body,}, {transaction: tx})
		.then(result => {
			tx.commit();
		}).catch(err => {
			tx.rollback();
			console.log(err);
			reject(err);
		});
	});
};

function modifyNickname(app_user_id, new_nickname) {
	console.log('modifyNickname');
	return sequelize.transaction().then(tx => {
		return UserInfo.update({nickname: new_nickname}, {where: {app_user_id: app_user_id}, transaction: tx})
			.then((updatedRowCount) => {
			console.log("updateRowCount : " + updatedRowCount);
			tx.commit();
		}).catch(error => {
			console.log("promise inside catch = " + error);
			tx.rollback();
			reject(error);
		});
	});
};

function deleteUserInfo(app_user_id) {
	console.log('deleteUserInfo');
	sequelize.transaction().then(tx => {
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
exports.mergeUserInfo = mergeUserInfo;
exports.createLog = createLog;
exports.modifyNickname = modifyNickname;
exports.deleteUserInfo = deleteUserInfo;

exports.getUserInfo = getUserInfo;
exports.getUsers = getUsers;
exports.getUserInfosFromNickname = getUserInfosFromNickname;
exports.getAllLogs = getAllLogs;
exports.getLogs = getLogs;