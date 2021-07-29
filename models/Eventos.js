const Sequelize = require('sequelize');
const db = require('../config/db');
const Usuarios = require('./Usuarios');

const Eventos=db.define('eventos', {
    id:{
        type:Sequelize.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
    },
    titulo:{
        type:Sequelize.STRING(80),
        allowNull:false,        
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
    }
});

//Crea las relaciones con usuarios
Eventos.belongsTo(Usuarios,{foreignKey:'id_usuario'});

module.exports = Eventos;