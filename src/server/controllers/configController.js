const { models } = require('../models');

const retrieveConfigFromDB = async () => {
	try {
		const config = await models.Config.findOne({
			attributes: ['currentAcademicYear', 'disableVotes', 'automaticEmails'],
		});
		if (!config) {
			const error = new Error('La configuración no existe.');
			error.statusCode = 404;
			throw error;
		}
		return config;
	} catch (error) {
		throw error;
	}
}

const retrieveCurrentAcademicYearFromDB = async () => {
    try {
        const config = await retrieveConfigFromDB();
        if (config.currentAcademicYear === undefined || config.currentAcademicYear === null) {
            const error = new Error('El año académico actual no existe.');
            error.statusCode = 404;
            throw error;
        }
        return config.currentAcademicYear;
    } catch (error) {
        throw error;
    }
};

const retrieveDisableVotesFromDB = async () => {
	try {
        const config = await retrieveConfigFromDB();
        if (config.disableVotes === undefined || config.disableVotes === null) {
            const error = new Error('No se ha podido recuperar la configuración de votos.');
            error.statusCode = 404;
            throw error;
        }
        return config.disableVotes;
    } catch (error) {
        throw error;
    }
};

const retrieveAutomaticEmailsFromDB = async () => {
    try {
        const config = await retrieveConfigFromDB();
        if (config.automaticEmails === undefined || config.automaticEmails === null) {
            const error = new Error('No se ha podido recuperar la configuración de emails automáticos.');
            error.statusCode = 404;
            throw error;
        }
        return config.automaticEmails;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    retrieveConfigFromDB,
    retrieveCurrentAcademicYearFromDB,
    retrieveDisableVotesFromDB,
    retrieveAutomaticEmailsFromDB,
}