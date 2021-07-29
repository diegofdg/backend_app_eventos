//Importamos las dependencias
const FechaEventos = require('../models/FechaEventos');

// Listar todos las fechas eventos
exports.getFechaEventos = async(req,res,next) => {
    try{
        const result = await FechaEventos.findAll(); 
        if(result.length !== 0){             
            return res.status(200).json(result);
        } else {            
            return res.status(204).json({                
                Error: 'No existen fecha eventos registrados'
            });        
        }
    }
    catch(error){        
        console.log(error);
    }
}