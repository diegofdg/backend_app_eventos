const express = require('express');
const router = express.Router();

const eventsController = require('../controllers/eventsController');
const usersController = require('../controllers/usersController');
const loginController = require('../controllers/loginController');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/events',eventsController.getEvents);
router.get('/events/:id',eventsController.getEventById);
router.get('/share-event',eventsController.shareEvent);
router.get('/starred-events',eventsController.getStarredEvents);

router.post('/users',usersController.createUser);
router.post('/auth',loginController.loginTokenUser);
router.post('/events',eventsController.createEvent);
router.get('/users/events/:page?',eventsController.getUserEvents);

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' });
};

router.use(unknownEndpoint);

module.exports = router;