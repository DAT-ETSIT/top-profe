const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
	}
	User.init({
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		type: {
			type: DataTypes.ENUM('student', 'professor', 'other'),
			allowNull: false,
		},
		admin: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			default: false,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			default: false,
		},
		excluded: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			default: false,
		},
	}, {
		sequelize,
	});
	return User;
};
