const Sequelize = require('sequelize');
const db = require('../config/db');

const Usuarios = db.define('usuarios', {
    id:{
        type:Sequelize.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
    },
    nombre:{
        type:Sequelize.STRING(40),
        allowNull:false,  
        validate: {                        
            is: {
                args: ["^[a-z]+$",'i'],
                msg: 'El Nombre no puede estar vacio o contener números'
            },        
        }     
    },    
    apellido:{
        type:Sequelize.STRING(40),
        allowNull:false,     
        validate: {                        
            is: {
                args: ["^[a-z]+$",'i'],
                msg: 'El Apellido no puede estar vacio o contener números'
            },        
        }   
    },   
    usuario:{
        type:Sequelize.STRING(40),
        allowNull:false,    
        validate: {                        
            is: {
                args: ["^[a-z]+$",'i'],
                msg: 'El Usuario no puede estar vacio o contener números'
            },        
        }    
    },  
    clave:{
        type:Sequelize.STRING(60),
        allowNull:false,        
    }
});

module.exports = Usuarios;