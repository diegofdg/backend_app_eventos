//Importamos las dependencias
const jwt = require('jsonwebtoken');
const Usuarios = require('../models/Usuarios')
const Eventos = require('../models/Eventos');
const DetallesEventos = require('../models/DetallesEventos');

/***************** VISITANTE ******************/

// Listar todos los eventos ordenados por fecha
exports.getEventos = async (req, res) => {
    try {
        const result = await Eventos.findAll({            
            order: [
                ["fecha", "desc"],
                ["hora", "desc"],
            ]
        });

        if (result.length !== 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({
                Error: "No existen eventos registrados",
            });
        }
    } catch (error) {
        return res.status(404).json(error);
    }
};

// Compartir un evento por twitter seguún el id
exports.compartirEvento = async (req, res) => {

    try {
        const { id } = req.body;
        console.log(id)
        const result = await Eventos.findAll({
            where: {
                id,
            },
            attributes: ["titulo", "imagenUrl","fecha", "hora"],            
        });          
        if (result.length !== 0) {            
            const resultObject = result.map(ro =>{
                return Object.assign({},{
                    titulo: ro.titulo,
                    imagenUrl: ro.imagenUrl,
                    fecha: ro.fecha,
                    hora: ro.hora
                });                
            });               
            const respuesta = `Iré al ${resultObject[0].titulo} el ${resultObject[0].fecha} a las ${resultObject[0].hora} @ link -> ${resultObject[0].imagenUrl}`
            return res.status(200).json(respuesta);
        } else {            
            return res.status(404).json({
                Error: "No existe el evento",
            });
        }
    } catch (error) {
        return res.status(404).json(error);
    }    
};

// Listar los detalles de un evento por id
exports.getEventoById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Eventos.findAll({
            where: {
                id,
            },
            attributes: ["titulo", "destacado", "imagenUrl", "fecha", "hora"],
            include: [
                {
                    attributes: ["descripcion", "latitud", "longitud", "precio"],
                    model: DetallesEventos,
                    as: "detallesevento",
                },
            ],
        });        
        if (result.length !== 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({
                Error: "No existe el evento",
            });
        }
    } catch (error) {
        return res.status(404).json(error);
    }
};

// Listar eventos destacados
exports.getEventosDestacados = async (req, res) => {
    try {        
        const result = await Eventos.findAll({
            where: {
                destacado: 1,
            },
            attributes: ["titulo", "imagenUrl","fecha", "hora"],
            include: [
                {
                    attributes: ["descripcion", "latitud", "longitud", "precio"],
                    model: DetallesEventos,
                    as: "detallesevento",
                },
            ],
            order: [
                ["fecha", "desc"],
                ["hora", "desc"],
            ],
        });
        if (result.length !== 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({
                Error: "No existen eventos destacados.",
            });
        }
    } catch (error) {
        return res.status(404).json(error);
    }
};

/***************** USUARIO REGISTRADO ******************/

// Obtener el token del encabezado
const getToken = req => {
    const authorization = req.get('Authorization');
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        return authorization.substring(7);
    }
    return null;
}

// Crear un evento
exports.createEvento = async (req, res) => {
    const { titulo, destacado, imagenUrl, fecha, hora, descripcion, latitud, longitud, precio } = req.body;
    const token = getToken(req);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if(!token || !decodedToken.id){
        return res.status(401).json({
            Error: "No se encuentra el token o es inválido",
        });
    }
    try {
        const usuario = await Usuarios.findOne({
            where: {
                id: decodedToken.id
            }
        });
        const nuevoEvento = {
            titulo,            
            destacado,
            imagenUrl,
            fecha,
            hora,
            usuario_id: usuario.id
        }
        const eventoCreado = await Eventos.create(nuevoEvento);
        if (eventoCreado != null) {
            const evento_id = eventoCreado.id;
            const nuevoDetalle = {
                descripcion,
                latitud,
                longitud,
                precio,
                evento_id
            }            
            const detalleCreado = await DetallesEventos.create(nuevoDetalle);
            if(detalleCreado != null) {
                const result = { ...eventoCreado.dataValues,...detalleCreado.dataValues }
                return res.status(200).send(result);
            } else {
                return res.status(404).json({
                    Error: "No se pudo realizar el registro",
                });
            }            
        } else {
            return res.status(404).json({
                Error: "No se pudo realizar el registro",
            });
        }
    } catch (error) {
        return res.status(404).json(error);
    }
};

// Listar eventos del usuario paginados
exports.getEventosUsuario = async (req, res) => {
    const token = getToken(req);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if(!token || !decodedToken.id){
        return res.status(401).json({
            Error: "No se encuentra el token o es inválido",
        });
    }    

    let pagina = req.params.page;
    const registros = 3;
    if(pagina===undefined){
        pagina = 0;
    } else {
        pagina = Number(pagina);
        if (isNaN(pagina)){
            return res.status(404).json({
                Error: "Hay un problema con la url.",
            });
        } else {
            pagina = (pagina -1) * registros
        }
    } 
        
    try {        
        const result = await Eventos.findAll({
            where: {
                usuario_id: decodedToken.id,
            },
            attributes: ["titulo", "imagenUrl", "fecha", "hora"],
            include: [
                {
                    attributes: ["descripcion","latitud", "longitud", "precio"],
                    model: DetallesEventos,
                    as: "detallesevento",
                },
            ],
            order: [
                ["fecha", "desc"],
                ["hora", "desc"],
            ],
            limit: 3,
            offset: pagina
        });
        
        if (result.length !== 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({
                Error: "No existen eventos destacados.",
            });
        }
    } catch (error) {        
        return res.status(404).json(error);
    }
};