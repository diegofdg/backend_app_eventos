//Importamos las dependencias
const Usuarios = require('../models/Usuarios');
const Eventos = require('../models/Eventos');

// Login de usuario
exports.loginUsuario = async(req,res,next) => {
    try{
        const { usuario, clave } = body;
        const result = await Usuarios.findOne({
            usuario
        });         
        if(result.length !== 0){
            if(clave === result.clave){
                return res.status(200).json({
                    Mensaje: `El usuario ${usuario} ha hecho un login correcto.`
                });
            } else {
                return res.status(401).json({                
                    Error: 'Usuario o Password incorrectos'
                });        
            }            
        } else {            
            return res.status(204).json({                
                Error: 'No existe el usuario'
            });        
        }
    }
    catch(error){        
        console.log(error);
    }
}