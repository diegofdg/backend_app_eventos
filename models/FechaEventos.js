const Sequelize = require('sequelize');
const Eventos = require('./Eventos');
const db = require('../config/db');

const FechaEventos=db.define('fechaeventos', {    
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

//Crea las relaciones con eventos
FechaEventos.belongsTo(Eventos,{foreignKey:'id_evento'}); //persona_id

module.exports = FechaEventos;