const { models, sequelize } = require('../models');

const config = require('../config.json');

module.exports.getNote = async (req, res, next) => {
	const { degreeId } = req.params;

	try {
		const degree = await models.Degree.findByPk(degreeId);
		res.status(200).send(degree);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener la titulación.' });
	}
};


module.exports.createNote = async (req, res, next) => {
	try {
		const { degreeId, academicYear } = req.params;
		const { missingProfessors } = req.body;

		const currentProfessors = await models.Professor.findAll();
		const currentBallots = await models.Ballot.findAll({ where: { degreeId, academicYear } });

		Object.values(missingProfessors).forEach(async (professor) => {
			if (!currentProfessors.find(p => p.id === professor.id)) {
				await models.Professor.create({
					id: professor.id, hash: createHash('sha256').update(professor.id).digest('hex'), name: professor.name, email: professor.email, status: 'active',
				});
			}

			professor.subjectId.forEach(async (subject) => {
				if (!currentBallots.find(b => b.professorId.strip().toLowerCase() === professor.id.strip().toLowerCase() && parseInt(b.subjectId, 10) === parseInt(subject, 10))) {
					await models.Ballot.create({
						academicYear, professorId: professor.id, subjectId: subject, degreeId,
					});
				}
			});
		});

		res.status(200).json({ message: 'Profesores importados correctamente.' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al importar los datos de los profesores.' });
	}
};

module.exports.updateNote = async (req, res, next) => {
	const { professor } = req.body;
	try {
		const currrentProfessor = await models.Professor.findByPk(professor.id);

		if (!currrentProfessor) return res.status(404).json({ message: 'Profesor no encontrado.' });

		const {
			id, name, status,
		} = professor;

		currrentProfessor.id = id;
		currrentProfessor.name = name;
		currrentProfessor.status = status;

		await currrentProfessor.save();

		return res.status(200).json({ message: 'Profesor actualizado.' });
	} catch (error) {
		return res.status(500).json({ message: 'Error al actualizar el profesor.' });
	}
};