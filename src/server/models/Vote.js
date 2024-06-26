const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Vote extends Model {
	}
	Vote.init({
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
		},
		stars: {
			type: DataTypes.SMALLINT,
			allowNull: false,
		},
	}, {
		sequelize,
		timestamps: false,
	});
	return Vote;
};
