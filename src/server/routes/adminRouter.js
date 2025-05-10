const express = require('express');
const adminController = require('../controllers/adminController');
const mainController = require('../controllers/mainController');
const middlewares = require('./middlewares');


const adminRouter = express.Router();

adminRouter.use(middlewares.restrictAdmins);

adminRouter.get('/', mainController.getUser);
adminRouter.get('/degrees', adminController.getDegrees);
adminRouter.get('/degrees/:degreeId', adminController.getDegree);

adminRouter.get('/subjects/:degreeId', adminController.getSubjects);

adminRouter.get('/update/subjects/:degreeId', adminController.fetchSubjects);
adminRouter.post('/update/subjects/:degreeId', adminController.importSubjects);

adminRouter.get('/update/professors/:degreeId/:academicYear', adminController.fetchProfessors);
adminRouter.post('/update/professors/:degreeId/:academicYear', adminController.importProfessors);

adminRouter.get('/professors', adminController.getProfessors);
adminRouter.put('/professors', adminController.updateProfessor);

adminRouter.get('/users', adminController.getUsers);
adminRouter.put('/users', adminController.updateUser);

adminRouter.put('/update/config', adminController.updateConfig);

module.exports = adminRouter;