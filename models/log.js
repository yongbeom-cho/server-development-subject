module.exports = (sequelize, DataTypes) => (
	sequelize.define('log', 
	{
		type: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false,
		},
		header: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: false,
		},
		body: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: false,
		},
	}, {
		timestamps: false,
		paranoid: false,
	})
);

