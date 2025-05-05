const express = require('express');
const mainController = require('../controllers/mainController');


const accountActivationRouter = express.Router();

accountActivationRouter.get('/user', mainController.getUser);
accountActivationRouter.post('/user/activate', mainController.activateUser);
accountActivationRouter.post('/user/degree', mainController.setUserDegree);
accountActivationRouter.get('/degrees', mainController.getDegrees);

module.exports = accountActivationRouter;