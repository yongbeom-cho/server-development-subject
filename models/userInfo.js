module.exports = (sequelize, DataTypes) => (
    sequelize.define('userInfo', {
			app_user_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
				unique: true,
			},
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      access_token: {
        type: DataTypes.STRING,
        allowNull: false,
				unique: true,
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: false,
				unique: true,
      },
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: sequelize.literal('now()'),
			},
    }, {
      timestamps: false,
      paranoid: false,
    })
  );

