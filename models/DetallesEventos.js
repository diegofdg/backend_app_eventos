const Sequelize = require('sequelize');
const db = require('../config/db');
const Eventos = require('./Eventos');

const DetallesEventos = db.define('detalleseventos', {
    id:{
        type:Sequelize.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
    },
    descripcion:{
        type:Sequelize.TEXT,
        allowNull:false,        
    },    
    latitud:{
        type:Sequelize.DECIMAL(9,6),
        allowNull:false,        
    },
    longitud:{
        type:Sequelize.DECIMAL(9,6),
        allowNull:false,        
    },
    precio:{
        type:Sequelize.DECIMAL(14,2),
        allowNull:false,
    }
});

module.exports = DetallesEventos;