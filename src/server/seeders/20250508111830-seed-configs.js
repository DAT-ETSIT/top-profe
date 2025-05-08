'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Configs', [{
            currentAcademicYear: '2023-24',
            disableVotes: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }], {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Configs', null, {});
    },
};