//Importamos las dependencias
const Eventos = require('../models/Eventos');

// Listar todos las eventos
exports.getEventos = async(req,res,next) => {
    try{
        const result = await Eventos.findAll(); 
        if(result.length !== 0){             
            return res.status(200).json(result);
        } else {            
            return res.status(204).json({                
                Error: 'No existen eventos registrados'
            });        
        }
    }
    catch(error){        
        console.log(error);
    }
}