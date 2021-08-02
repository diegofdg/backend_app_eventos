const Sequelize = require('sequelize');
const db = require('../config/db');
const Usuarios = require('./Usuarios');
const DetallesEventos = require('./DetallesEventos');

const Eventos = db.define('eventos', {
    id:{
        type:Sequelize.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
    },
    titulo:{
        type:Sequelize.STRING(80),
        allowNull:false, 
        validate: {                        
            is: {
                args: /^[a-z\s]+$/i,
                msg: 'El título no puede estar vacio o contener números'
            },        
        }       
    },           
    destacado:{
        type:Sequelize.BOOLEAN,
        allowNull:false,        
    },  
    imagenUrl:{
        type:Sequelize.STRING(100),
        allowNull:false,        
    },
    fecha:{
        type:Sequelize.DATEONLY,
        allowNull:false,
    },
    hora:{
        type:Sequelize.TIME,
        allowNull:false,    
    }    
});

//Crea las relaciones con eventos
DetallesEventos.belongsTo(Eventos,{foreignKey:'evento_id'});
Eventos.hasOne(DetallesEventos,{foreignKey:'evento_id'});

//Crea las relaciones con usuarios
Eventos.belongsTo(Usuarios,{foreignKey:'usuario_id'});
Usuarios.hasMany(Eventos);

module.exports = Eventos;