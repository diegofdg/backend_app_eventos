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
exports.createFechaEvento = async(detalle) => {
    const { descripcion, latitud, longitud, precio, evento_id } = detalle;
    try{                        
        const result = await DetallesEventos.create({
            descripcion,
            latitud,
            longitud,
            precio,            
            evento_id
        }); 
        if(result != null){
            return result.dataValues;
        } else {
            return null;
        }
    }
    catch(error){
        return null;
    }
}