//Importamos las dependencias
const DetallesEventos = require('../models/DetallesEventos');

// Listar todos las fechas eventos ordenados del mas nuevo al mas viejo
exports.getFechaEventos = async(req,res,next) => {
    try{
        
        const result = await DetallesEventos.findAll({});
        if(result.length !== 0){             
            return res.status(200).json(result);
        } else {            
            return res.status(404).json({                
                Error: 'No existen fecha eventos registrados'
            });        
        }
    }
    catch(error){        
        return res.status(404).json(error);
    }
}

// Crear una fecha evento
exports.createFechaEvento = async(req,res,next) => {
    const { fecha, hora, precio, id_evento } = req.body;
    try{                        
        const result = await DetallesEventos.create({
            fecha,
            hora,
            precio,            
            id_evento
        }); 
        if(result != null){
            return res.status(200).json(result.dataValues);
        } else {
            return res.status(404).json({                
                Error: 'No se pudo realizar el registro'
            });        
        }
    }
    catch(error){
        return res.status(404).json(error);
    }
}