//Importamos las dependencias
const Usuarios = require('../models/Usuarios');

// Listar todos los usuario
exports.getUsuario = async(req,res,next) => {
    try{
        const result = await Usuarios.findAll(); 
        if(result.length !== 0){             
            return res.status(200).json(result);
        } else {            
            return res.status(204).json({                
                Error: 'No existen usuarios registrados'
            });        
        }
    }
    catch(error){        
        console.log(error);
    }
}