const Sequelize = require('sequelize');
const db = require('../config/db');
const Usuarios = require('./Usuarios');
const FechaEventos = require('./FechaEventos');

const Eventos = db.define('eventos', {
    id:{
        type:Sequelize.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
    },
    titulo:{
        type:Sequelize.STRING(80),
        allowNull:false, 
        /* validate: {                        
            is: {
                args: ["^[a-z]+$",'i'],
                msg: 'El nombre no puede estar vacio o contener números'
            },        
        }        */
    },    
    descripcion:{
        type:Sequelize.TEXT,
        allowNull:false,        
    },   
    destacado:{
        type:Sequelize.BOOLEAN,
        allowNull:false,        
    },  
    imagenUrl:{
        type:Sequelize.STRING(100),
        allowNull:false,        
    },
    latitud:{
        type:Sequelize.DECIMAL(9,6),
        allowNull:false,        
    },
    longitud:{
        type:Sequelize.DECIMAL(9,6),
        allowNull:false,        
    }
});

//Crea las relaciones con eventos
FechaEventos.belongsTo(Eventos);
Eventos.hasOne(FechaEventos);

//Crea las relaciones con usuarios
Eventos.belongsTo(Usuarios);
Usuarios.hasMany(Eventos);

module.exports = Eventos;