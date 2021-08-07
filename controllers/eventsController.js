const { Op } = require('sequelize');
const Users = require('../models/Users');
const Events = require('../models/Events');
const DetailsEvent = require('../models/DetailsEvent');
const loginController= require('../controllers/loginController');
const eventDetailsController = require('../controllers/eventDetailsController');

function getCurrentDate() {
	const today = new Date();
	const day = today.getDate();
	const month = today.getMonth()+1;
	const year = today.getFullYear();
	return new Date (String ( year + '-' + month + '-' + day ));
}

exports.getEvents = async (req, res) => {
	const current_date = getCurrentDate();

	try {
		const result = await Events.findAll({

			attributes: ['title', 'description','location', 'starred', 'image_url'],
			include: [
				{
					attributes: ['date', 'time', 'price'],
					model: DetailsEvent,
					where: { date: { [Op.gte]:current_date } },
					as: 'detailsevent',
				},
			],
			order: [
				['detailsevent', 'date', 'desc'],
				['detailsevent', 'time', 'desc'],
			]
		});

		if (result.length !== 0){
			return res.status(200).json(result);
		} else {
			return res.status(404).json({
				Error: 'there are no events.',
			});
		}
	} catch (error) {
		return res.status(404).json(error);
	}
};

exports.shareEvent = async (req, res) => {
	try {
		const { id } = req.body;
		const result = await Events.findAll({
			where: {
				id,
			},
			attributes: ['title', 'image_url'],
			include: [
				{
					attributes: ['date'],
					model: DetailsEvent,
					as: 'detailsevent',
				},
			],
		});
		if (result.length !== 0){
			const resultObject = result.map(ro => {
				return Object.assign(
					{},
					{
						title: ro.title,
						image_url: ro.image_url,
						date: result[0].detailsevent.date
					});
			});
			const response = `i will go to ${resultObject[0].title} on ${resultObject[0].date} ${resultObject[0].image_url}`;
			return res.status(200).json(response);
		} else {
			return res.status(404).json({
				Error: 'event does not exist.',
			});
		}
	} catch (error) {
		return res.status(404).json(error);
	}
};

exports.getEventById = async (req, res) => {
	try {
		const { id } = req.params;

		const result = await Events.findAll({
			where: {
				id,
			},
			attributes: ['title', 'description', 'location', 'starred', 'image_url'],
			include: [
				{
					attributes: ['date', 'time', 'price'],
					model: DetailsEvent,
					as: 'detailsevent',
				},
			],
		});

		if (result.length !== 0){
			return res.status(200).json(result);
		} else {
			return res.status(404).json({
				Error: 'event does not exist.',
			});
		}
	} catch (error) {
		return res.status(404).json(error);
	}
};

exports.getStarredEvents = async (req, res) => {
	const current_date = getCurrentDate();

	try {
		const result = await Events.findAll({
			where: {
				starred: 1,
			},
			attributes: ['title', 'description', 'image_url'],
			include: [
				{
					attributes: ['date', 'time', 'price'],
					model: DetailsEvent,
					where: { date: { [Op.gte]:current_date } },
					as: 'detailsevent',
				},
			],
			order: [
				['detailsevent', 'date', 'desc'],
				['detailsevent', 'time', 'desc'],
			],
		});
		if (result.length !== 0) {
			return res.status(200).json(result);
		} else {
			return res.status(404).json({
				Error: 'there are no starred events.',
			});
		}
	} catch (error) {
		return res.status(404).json(error);
	}
};

exports.createEvent = async (req, res) => {

	const { title, description, starred, image_url, location } = req.body;
	try {
		const token = loginController.getToken(req);
		const decodedToken = loginController.decodeSecret(token);

		if(!loginController.validateToken(token)){
			return res.status(401).json({
				Error: 'token is missing or invalid.'
			});
		}

		const user = await Users.findAll({
			where: {
				id: decodedToken.id
			}
		});

		const newEvent = {
			title,
			description,
			starred,
			image_url,
			location,
			userId: user[0].id
		};

		const eventCreated = await Events.create(newEvent);
		if (eventCreated !== null) {
			const eventId = eventCreated.id;
			const details = req.body.details;
			const info = await eventDetailsController.createEventDetails(eventId,details);

			if(info !== null) {
				const result = {
					...eventCreated.dataValues,
					details: {
						info
					}
				};
				return res.status(201).send(result);
			} else {
				return res.status(404).json({
					Error: 'registration failed.'
				});
			}
		} else {
			return res.status(404).json({
				Error: 'registration failed.'
			});
		}
	} catch (error) {
		return res.status(404).json(error);
	}
};

exports.getUserEvents = async (req, res) => {
	const token = loginController.getToken(req) || null;
	const decodedToken = loginController.decodeSecret(token);

	if(!loginController.validateToken(token)){
		return res.status(401).json({
			Error: 'token is missing or invalid.'
		});
	}

	let page = req.params.page;
	const count = 3;
	if(page === undefined){
		page = 0;
	} else {
		page = Number(page);
		if (isNaN(page)){
			return res.status(404).json({
				Error: 'there is a problem with url.',
			});
		} else {
			page = (page -1) * count;
		}
	}

	try {
		const result = await Events.findAll({
			where: {
				userId: decodedToken.id,
			},
			attributes: ['title', 'description', 'image_url'],
			include: [
				{
					attributes: ['date', 'time', 'price'],
					model: DetailsEvent,
					as: 'detailsevent',
				},
			],
			order: [
				['detailsevent', 'date', 'desc'],
				['detailsevent', 'time', 'desc'],
			],
			limit: 3,
			offset: page
		});

		if (result.length !== 0) {
			return res.status(200).json(result);
		} else {
			return res.status(404).json({
				Error: 'there are no events.',
			});
		}
	} catch (error) {
		return res.status(404).json(error);
	}
};