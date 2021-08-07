const Sequelize = require('sequelize');
const db = require('../config/db');

const Users = db.define('users', {
	id:{
		type:Sequelize.INTEGER(11),
		primaryKey:true,
		autoIncrement:true
	},
	name:{
		type:Sequelize.STRING(40),
		allowNull:false,
		validate: {
			notEmpty:{
				msg: 'name cannot be empty.'
			},
			isAlpha: {
				msg: 'name contains invalid characters (letters only!)'
			},
		}
	},
	surname:{
		type:Sequelize.STRING(40),
		allowNull:false,
		validate: {
			notEmpty:{
				msg: 'last_name cannot be empty.'
			},
			isAlpha: {
				msg: 'last_name contains invalid characters (letters only!)'
			},
		}
	},
	user:{
		type:Sequelize.STRING(40),
		allowNull:false,
		validate: {
			notEmpty:{
				msg: 'user cannot be empty.'
			},
			isAlphanumeric: {
				msg: 'user contains invalid characters (letters and numbers only!)'
			},
		}
	},
	password:{
		type:Sequelize.STRING(60),
		allowNull:false,
	}
});

module.exports = Users;