const Sequelize = require('sequelize');
const db = require('../config/db');

const DetailsEvent = db.define('detailsevent', {
    id:{
        type:Sequelize.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
    },
    date:{
        type:Sequelize.DATEONLY,
        allowNull:false,
        validate:{
            notEmpty:{
                msg: 'date cannot be empty.'
            },
        }
    },
    time:{
        type:Sequelize.TIME,
        allowNull:false,
        validate:{
            notEmpty:{
                msg: 'time cannot be empty.'
            },
        }    
    },
    price:{
        type:Sequelize.DECIMAL(14,2),
        allowNull:false,
        validate:{
            notEmpty:{
                msg: 'price cannot be empty.'
            },
        }
    }
});

module.exports = DetailsEvent;