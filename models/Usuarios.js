const Sequelize = require('sequelize');
const db = require('../config/db');

const Usuarios=db.define('usuarios', {
    id:{
        type:Sequelize.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
    },
    nombre:{
        type:Sequelize.STRING(40),
        allowNull:false,        
    },    
    apellido:{
        type:Sequelize.STRING(40),
        allowNull:false,        
    },   
    alias:{
        type:Sequelize.STRING(40),
        allowNull:false,        
    },  
    clave:{
        type:Sequelize.STRING(60),
        allowNull:false,        
    }
});

module.exports = Usuarios;