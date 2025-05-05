const express = require('express');
const ballotController = require('../controllers/ballotController');
const middlewares = require('./middlewares');


const verifiedStudentsRouter = express.Router();

verifiedStudentsRouter.use(middlewares.restrictLimitedUsers);

verifiedStudentsRouter.post('/ballots/:ballotId', ballotController.registerVote);
verifiedStudentsRouter.get('/votes/:voteId', ballotController.getVote);
verifiedStudentsRouter.get('/votes/:voteId/confirmation', ballotController.getVoteConfirmation);
verifiedStudentsRouter.delete('/votes/:voteId', ballotController.deleteVote);

module.exports = verifiedStudentsRouter;