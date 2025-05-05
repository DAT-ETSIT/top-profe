const express = require('express');

// Middlewares for access management.
const middlewares = require('./middlewares');

// Controllers
const mainController = require('../controllers/mainController');
const professorController = require('../controllers/professorController');
const subjectController = require('../controllers/subjectController');
const rankingController = require('../controllers/rankingController');

// Feature specific routers.
const accountActivationRouter = require('./accountActivationRouter');
const verifiedStudentsRouter = require('./verifiedStudentsRouter');
const adminRouter = require('./adminRouter');


// Router for the application.
const router = express.Router();

router.get('/votes', mainController.getVotes);

// ONLY LOGGED USERS, NOT EXCLUDED
router.use(middlewares.checkLogin);
router.use(middlewares.restrictExcluded);

router.use(accountActivationRouter)

// ONLY ACTIVE USERS
router.use(middlewares.checkActive);

// Teachers that don't wanna participate in the application can opt-out.
router.post('/opt-out', mainController.setOptOut);


router.get('/professors', professorController.getProfessors);
router.get('/professors/:professorHash', professorController.getProfessorProfile);
router.get('/subjects', subjectController.getSubjects);
router.get('/subjects/:subjectId', subjectController.getSubjectDetails);

// TODO: Implement the following endpoints.
router.get('/rankings/votes', rankingController.getMostVoted);

// ONLY STUDENTS: Register, get and delete specific votes.
router.use('/verified', verifiedStudentsRouter);

// ONLY ADMIN
router.use('/admin', adminRouter);

module.exports = router;
