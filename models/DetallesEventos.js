const Sequelize = require('sequelize');
const db = require('../config/db');

const DetallesEventos = db.define('detalleseventos', {
    id:{
        type:Sequelize.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
    },
    fecha:{
        type:Sequelize.DATEONLY,
        allowNull:false,
    },
    hora:{
        type:Sequelize.TIME,
        allowNull:false,    
    },
    precio:{
        type:Sequelize.DECIMAL(14,2),
        allowNull:false,
    }
});

module.exports = DetallesEventos;