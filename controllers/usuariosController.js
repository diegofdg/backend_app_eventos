//Importamos las dependencias
const Usuarios = require('../models/Usuarios');
const Eventos = require('../models/Eventos');

// Listar todos los usuarios
exports.getUsuario = async(req,res,next) => {
    try{
        const result = await Usuarios.findAll(
            {
                include: [
                    {
                      model: Eventos,
                      order: [['id', 'DESC']]    
                    }
                ]
            }            
        ); 
        if(result.length !== 0){    

            const resultado = result.map(user => {
                return Object.assign(
                    {},
                    {
                        id: user.id,
                        nombre: user.nombre,
                        apellido: user.apellido,
                        alias: user.alias,
                        eventos: user.eventos.map(eventito => {
                            return Object.assign(
                                {},
                            {
                                id: eventito.id,
                                titulo: eventito.titulo,
                                descripcion: eventito.descripcion,
                                destacado: eventito.destacado
                            }

                            )
                        }
                            
                            )
                    }
                    )
            });
            return res.status(200).json(resultado);
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