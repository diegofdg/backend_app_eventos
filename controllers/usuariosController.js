//Importamos las dependencias
const bcrypt = require('bcrypt');
const Usuarios = require('../models/Usuarios');

// Crear un usuario
exports.crearUsuario = async(req,res) => {
    try {
        const { nombre, apellido, usuario, clave } = req.body;

        if(!nombre ||!apellido ||!usuario ||!clave ) return res.status(404).json({Error:'Los campos Nombre, Apellido , Usuario y Password son requeridos'}); 


        let result = await Usuarios.findOne({
            where:{
                    nombre,
                    apellido 
                }
        });

        if(result) return res.status(404).json({Error:'El Nombre y Apellido del Nuevo Usuario ya se encuentra registrado'}); 

        result = await Usuarios.findOne({
            where:{
                    usuario
            }
        });

        if(result) return res.status(404).json({Error:'El Nombre de Usuario ya se encuentra registrado '}); 

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(clave, saltRounds);
        
        const nuevoUsuario = await Usuarios.create({
            nombre,
            apellido,
            usuario,
            clave:passwordHash
        });

        return res.status(200).json({
            nuevoUsuario
        });
    } catch (error) {
        return res.status(404).json(error);    
    }
}