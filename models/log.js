module.exports = (sequelize, DataTypes) => (
	sequelize.define('log', 
	{
		is_req: {
			type: DataTypes.TINYINT,
			allowNull: false,
			unique: false,
		},
		header: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false,
		},
		body: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false,
		},
	}, {
		timestamps: false,
		paranoid: false,
	})
);

