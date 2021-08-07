const Sequelize = require('sequelize');
const db = require('../config/db');
const Users = require('./Users');
const DetailsEvent = require('./DetailsEvent');

const Events = db.define('events', {
	id:{
		type:Sequelize.INTEGER(11),
		primaryKey:true,
		autoIncrement:true
	},
	title:{
		type:Sequelize.STRING(80),
		allowNull:false,
		validate: {
			notEmpty:{
				msg: 'title cannot be empty.'
			},
			isAlphanumeric: {
				msg: 'title contains invalid characters (letters and numbers only!)'
			},
		}
	},
	description:{
		type:Sequelize.TEXT,
		allowNull:false,
		validate:{
			notEmpty:{
				msg: 'description cannot be empty.'
			},
		}
	},
	starred:{
		type:Sequelize.BOOLEAN,
		defaultValue:false,
		allowNull:false,
	},
	image_url:{
		type:Sequelize.STRING(100),
		allowNull:false,
		validate: {
			is: {
				isUrl: true,
			},
		}
	},
	location:{
		type:Sequelize.STRING(40),
		allowNull:false,
		validate:{
			notEmpty:{
				msg: 'location cannot be empty.'
			},
		}
	},
});

DetailsEvent.belongsTo(Events);
Events.hasOne(DetailsEvent);

Events.belongsTo(Users);
Users.hasMany(Events);

module.exports = Events;