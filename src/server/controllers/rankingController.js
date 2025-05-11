const { models, Sequelize } = require('../models');
const { retrieveCurrentAcademicYearFromDB } = require('./configController');

const config = require('../config.json');

module.exports.getMostVoted = async (req, res) => {
	// Returns a list with the 10 most voted professors registered in the application,
	// along with their average scoring.

	try {
		const currentAcademicYear = await retrieveCurrentAcademicYearFromDB();
		const mostVotedProfessors = await models.Professor.findAll({
			attributes: [
				'id',
				'hash',
				'name',
				'status',
				[Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('ballot->vote.stars')), 2), 'avg'],
				[Sequelize.fn('COUNT', Sequelize.col('ballot->vote.stars')), 'count'],
			],
			include: [{
				model: models.Ballot,
				as: 'ballot',
				attributes: [],
				required: true,
				where: {
					academicYear: currentAcademicYear,
				},
				include: [
					{
						model: models.Vote,
						as: 'vote',
						attributes: [],
						required: false,
					},
				],
			}],
			where: {
				status: 'active',
			},
			group: ['Professor.id', 'Professor.name'],
			order: [['count', 'DESC']],
		});


		return res.status(200).json({ mostVotedProfessors: mostVotedProfessors.slice(0, 10) });
	} catch (error) {
		console.log(error);
		const statusCode = error.statusCode || 500;
		return res.status(statusCode).json({ message: error.message ||'Error al obtener el ranking.' });
	}
};
