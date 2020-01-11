const sequelize = require('../models').sequelize;
const Op = require('../models').Sequelize.Op;
const { UserInfo, Log }= require('../models');

async function createUserInfo(app_user_id, nickname, access_token, refresh_token) {
    let tx;
    try {
        tx = await sequelize.transaction();
        await UserInfo.create({app_user_id, nickname, access_token, refresh_token}, {transaction: tx});
        await tx.commit();
        return true;
    } catch (err) {
        if (tx) await tx.rollback();
        return false;
    }
};

async function updateUserInfo(app_user_id, nickname, access_token, refresh_token) {
    let tx;
    try {
        tx = await sequelize.transaction();
        const updateRowCount = await UserInfo.update({nickname: nickname, access_token: access_token, refresh_token: refresh_token}, {where: {app_user_id: app_user_id}, transaction: tx});
        await tx.commit();
        return true;
    } catch (err) {
        if (tx) await tx.rollback();
        return false;
    }
};

async function mergeUserInfo(app_user_id, nickname, access_token, refresh_token) {
    try {
        const obj = await UserInfo.findOne({ where: { app_user_id : app_user_id} });
        if (obj) {
            return await updateUserInfo(app_user_id, nickname, access_token, refresh_token);
        } else {
            return await createUserInfo(app_user_id, nickname, access_token, refresh_token);
        }
    } catch (err) {
        return false;
    }
};

async function createLog(type, header, body) {
    let tx;
    try {
        tx = await sequelize.transaction();
        await Log.create({type, header, body}, {transaction: tx});
        await tx.commit();
        return true;
    } catch (err) {
        if (tx) await tx.rollback();
        return false;
    }
};

async function modifyNickname(app_user_id, new_nickname) {
    let tx;
    try {
        tx = await sequelize.transaction();
        const updateRowCount = await UserInfo.update({nickname: new_nickname}, {where: {app_user_id: app_user_id}, transaction: tx});
        await tx.commit();
        return true;
    } catch (err) {
        if (tx) await tx.rollback();
        return false;
    }
};

async function deleteUserInfo(app_user_id) {
    let tx;
    try {
        tx = await sequelize.transaction();
        const deletedRowCount = await UserInfo.destroy({where: {app_user_id: app_user_id}});
        await tx.commit();
        return true;
    } catch (err) {
        if (tx) await tx.rollback();
        return false;
    }
};

async function getUserInfo(app_user_id) {
    var id, nickname, access_token, refresh_token, created_at;
    try {
        const userInfo = await UserInfo.findOne({ where: { app_user_id : app_user_id} });
        if (userInfo) {
            id = userInfo.dataValues.id;
            nickname = userInfo.dataValues.nickname;
            access_token = userInfo.dataValues.access_token;
            refresh_token = userInfo.dataValues.refresh_token;
            created_at = userInfo.dataValues.created_at;
        }
        return userInfo;
    } catch (error) {
        return null;
    }
};

async function getUserInfos() {
    try {
        const users = await UserInfo.findAll();
        return users;
    } catch (error) {
        return null;
    }
}

async function getUserInfosFromNickname(nickname) {
    try {
        const users= await UserInfo.findAll({ where: { nickname : nickname} });
        return users;
    } catch (error) {
        return null;
    }
}

async function getAllLogs() {
	try {
        const logs = await Log.findAll();
        return logs;
    } catch (error) {
        return null;
    }
}

async function getLogs(search_content) {
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
		return logs;
	} catch (error) {
		return null;
	}
}

exports.mergeUserInfo = mergeUserInfo;
exports.createLog = createLog;
exports.modifyNickname = modifyNickname;
exports.deleteUserInfo = deleteUserInfo;

exports.getUserInfo = getUserInfo;
exports.getUserInfos = getUserInfos;
exports.getUserInfosFromNickname = getUserInfosFromNickname;
exports.getAllLogs = getAllLogs;
exports.getLogs = getLogs;
