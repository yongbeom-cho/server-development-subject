const sequelize = require('../models').sequelize;
const Op = require('../models').Sequelize.Op;
const { UserInfo, Log }= require('../models');

async function createUserInfo(app_user_id, nickname, access_token, refresh_token) {
    console.log('createUserInfo');
    let tx;
    try {
        tx = await sequelize.transaction();
        await UserInfo.create({app_user_id, nickname, access_token, refresh_token}, {transaction: tx});
        await tx.commit();
        return true;
    } catch (err) {
        if (tx) await tx.rollback();
        console.log('createUserInfo error : ' + err);
        return false;
    }
};

async function updateUserInfo(app_user_id, nickname, access_token, refresh_token) {
    console.log('updateUserInfo');
    let tx;
    try {
        tx = await sequelize.transaction();
        const updateRowCount = await UserInfo.update({nickname: nickname, access_token: access_token, refresh_token: refresh_token}, {where: {app_user_id: app_user_id}, transaction: tx});
        console.log("updateRowCount : " + updateRowCount);
        await tx.commit();
        return true;
    } catch (err) {
        if (tx) await tx.rollback();
        console.log('updateUserInfo error : ' +err);
        return false;
    }
};

async function mergeUserInfo(app_user_id, nickname, access_token, refresh_token) {
    console.log('mergeUserInfo');
    try {
        const obj = await UserInfo.findOne({ where: { app_user_id : app_user_id} });
        if (obj) {
            return await updateUserInfo(app_user_id, nickname, access_token, refresh_token);
        } else {
            return await createUserInfo(app_user_id, nickname, access_token, refresh_token);
        }
    } catch (err) {
        console.log('mergeUserInfo error : ' + err);
        return false;
    }
};

async function createLog(type, header, body) {
    console.log('createLog');
    let tx;
    try {
        tx = await sequelize.transaction();
        await Log.create({type, header, body}, {transaction: tx});
        await tx.commit();
        return true;
    } catch (err) {
        if (tx) await tx.rollback();
        console.log('createLog error : ' + err);
        return false;
    }
};

async function modifyNickname(app_user_id, new_nickname) {
    console.log('modifyNickname');
    let tx;
    try {
        tx = await sequelize.transaction();
        const updateRowCount = await UserInfo.update({nickname: new_nickname}, {where: {app_user_id: app_user_id}, transaction: tx});
        console.log("updateRowCount : " + updateRowCount);
        await tx.commit();
        return true;
    } catch (err) {
        if (tx) await tx.rollback();
        console.log('modifyNickname error : ' + err);
        return false;
    }
};

async function deleteUserInfo(app_user_id) {
    console.log('deleteUserInfo');
    let tx;
    try {
        tx = await sequelize.transaction();
        const deletedRowCount = await UserInfo.destroy({where: {app_user_id: app_user_id}});
        console.log("deletedRowCount : " + deletedRowCount);
        await tx.commit();
        return true;
    } catch (err) {
        if (tx) await tx.rollback();
        console.log('deleteUserInfo error : ' + err);
        return false;
    }
};

async function getUserInfo(app_user_id) {
    var id, nickname, access_token, refresh_token, created_at;
    try {
        const userInfo= await UserInfo.findOne({ where: { app_user_id : app_user_id} });
        if (userInfo) {
            console.log('getUserInfo userInfo count : 1');
        } else {
            console.log('getUserInfo userInfo count : 0');
        }
        id = userInfo.dataValues.id;
        nickname = userInfo.dataValues.nickname;
        access_token = userInfo.dataValues.access_token;
        refresh_token = userInfo.dataValues.refresh_token;
        created_at = userInfo.dataValues.created_at;
        var info = {id : id, app_user_id : app_user_id, nickname : nickname, access_token : access_token, refresh_token : refresh_token, created_at : created_at};
        return info;
    } catch (error) {
        console.error('getUserInfo error : ' + error);
        return null;
    }
};

async function getUsers() {
    console.log('getUsers');
    try {
        const users= await UserInfo.findAll();
        console.log('getUsers users count : ' + users.length);
        return users;
    } catch (error) {
        console.error('getUsers error : ' + error);
        return null;
    }
}

async function getUserInfosFromNickname(nickname) {
    console.log('getUserInfosFromNickname');
    try {
        const users= await UserInfo.findAll({ where: { nickname : nickname} });
        console.log('getUserInfosFromNickname user count : ' + users.length);
        return users;
    } catch (error) {
        console.error('getUserInfosFromNickname error : ' + error);
        return null;
    }
}

async function getAllLogs() {
    console.log('getAllLogs');
	try {
        const logs = await Log.findAll();
        console.log('getAllLogs count : ' + logs.length);
        return logs;
    } catch (error) {
        console.error('getAllLogs error : ' + error);
        return null;
    }
}

async function getLogs(search_content) {
    console.log('getLogs');
    try {
		const logs = await Log.findAll({
			where:{
				[Op.or]: [
                    {
						type: {
							[Op.like]: "%" + search_content + "%"
						}
					},
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
        console.log('getLogs count : ' + logs.length);
		return logs;
	} catch (error) {
		console.error('getLogs error : ' + error);
		return null;
	}
}

exports.mergeUserInfo = mergeUserInfo;
exports.createLog = createLog;
exports.modifyNickname = modifyNickname;
exports.deleteUserInfo = deleteUserInfo;

exports.getUserInfo = getUserInfo;
exports.getUsers = getUsers;
exports.getUserInfosFromNickname = getUserInfosFromNickname;
exports.getAllLogs = getAllLogs;
exports.getLogs = getLogs;