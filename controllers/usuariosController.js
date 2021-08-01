//Importamos las dependencias
const bcrypt = require('bcrypt');
const Usuarios = require('../models/Usuarios');

// Crear un usuario
exports.crearUsuario = async(req,res,next) => {
    try {
        const { nombre, apellido, usuario, clave } = req.body;
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(clave, saltRounds);        
        const nuevoUsuario = await Usuarios.create({
            nombre,
            apellido,
            usuario,
            clave: passwordHash
        });
        return res.status(200).json({
            nuevoUsuario
        });
    } catch (error) {
        return res.status(404).json(error);    
    }
}