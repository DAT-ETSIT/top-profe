/* eslint-disable max-len */
const { models } = require('../models');

const config = require('../config.json');

const { schoolCode } = config.server;
const studentCodes = ['A', 'W'];
const professorCodes = ['D', 'J', 'H', 'M', 'Q', 'U', 'P', 'C'];

const retrieveUserFromSession = (userInfo, excluded = false) => {
	let userType = 'other';

	if (Array.isArray(userInfo.upmClassifCode)) {
		console.log('ClassifCodesArray found');
		console.log(userInfo.upmClassifCode);

		userInfo.upmClassifCode.forEach((code) => {

			console.log(`Checking code: ${code}`);

			if (code.startsWith(`CentroLectivo:${schoolCode}:`)) {
				console.log('CentroLectivo found');
				console.log(`Code ends with: ${code.charAt(code.length - 1)}`);
				console.log(`Student codes: ${studentCodes}`);
				console.log(`Professor codes: ${professorCodes}`);
				if (studentCodes.includes(code.charAt(code.length - 1))) userType = 'student';
				if (professorCodes.includes(code.charAt(code.length - 1))) userType = 'professor';
				console.log(`User type set to: ${userType}`);
			}
			if (code.startsWith(`CentroPerfil:${schoolCode}:`)) {
				console.log('CentroPerfil found');
				console.log(`Code ends with: ${code.charAt(code.length - 1)}`);
				console.log(`Professor codes: ${professorCodes}`);
				if (professorCodes.includes(code.charAt(code.length - 1))) userType = 'professor';
				console.log(`User type set to: ${userType}`);
			}
		});
	}

	return {
		id: userInfo.preferred_username,
		email: userInfo.email,
		degreeId: null,
		type: userType,
		admin: false,
		active: false,
		excluded,
	};
};

const registerUser = async (userInfo) => {
	try {
		const user = retrieveUserFromSession(userInfo);

		await models.User.create(user);
		return user;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const updateUser = async (registeredUser, userInfo) => {
	try {
		const user = retrieveUserFromSession(userInfo, registeredUser.excluded);

		await registeredUser.save(user);
		return user;
	} catch (error) {
		console.log(error);
		return null;
	}
};

module.exports.handleLogin = async (req, res, next) => {
	try {
		const registeredUser = await models.User.findByPk(req.session.userInfo.preferred_username);

		let savedUser;
		if (registeredUser) {
			if (registeredUser.active) savedUser = registeredUser;
			else savedUser = await updateUser(registeredUser, req.session.userInfo);
		} else savedUser = await registerUser(req.session.userInfo);

		if (!savedUser) res.status(500).json({ message: 'Error al acceder a los datos del usuario.' });

		req.session.user = savedUser;

		return next();
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al recuperar el usuario.' });
	}
};
