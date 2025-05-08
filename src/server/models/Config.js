const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Config extends Model {}

    Config.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        currentAcademicYear: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '2023-24',
        },
        disableVotes: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        sequelize,
    });

    return Config;
};