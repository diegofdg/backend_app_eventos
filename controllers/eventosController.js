//Importamos las dependencias
const Eventos = require('../models/Eventos');
const FechaEventos = require('../models/FechaEventos');

// Listar todos las eventos
exports.getEventos = async(req,res,next) => {
    try{
        const result = await Eventos.findAll(
            /* {
            include: [
                {
                  model: FechaEventos,
                  order: [['fecha', 'DESC']]

                }
            ]
            } */
        );
        console.log(result)
        if(result.length !== 0){       
            /* const respuesta = result.map(evento => {
                //return evento.fechaevento
                console.log(evento.fechaevento)
                return Object.assign(
                    {},
                    {
                        evento_id: evento.id,
                        titulo: evento.titulo,
                        descripcion: evento.descripcion,
                        destacado: evento.destacado,
                        imagenUrl: evento.imagenUrl,
                        id_usuario: evento.id_usuario,
                        fechaevento: fechaevento.map(dato => {
                            return Object.assign(
                                {},
                                {
                                    dato
                                }
                            )
                        }),
                    }
                )
            }) */
            
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

// Crear un evento
exports.createEvento = async(req,res,next) => {
    const { titulo, descripcion, destacado, imagenUrl, id_usuario } = req.body;
    try{
        const result = await Eventos.create({
            titulo,
            descripcion,
            destacado,
            imagenUrl,
            id_usuario
        }); 
        if(result != null){
            return res.status(200).json(result.dataValues);
        } else {
            return res.status(204).json({                
                Error: 'No se pudo realizar el registro'
            });        
        }
    }
    catch(error){
        console.log(error);
    }
}