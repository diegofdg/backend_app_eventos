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
            attributes: ["titulo", "descripcion", "destacado", "imagenUrl"],
            include: [
                {
                    attributes: ["fecha", "hora", "precio"],
                    model: DetallesEventos,
                    as: "detallesevento",
                },
            ],
            order: [
                ["detallesevento", "fecha", "desc"],
                ["detallesevento", "hora", "desc"],
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
        const result = await Eventos.findAll({
            where: {
                id,
            },
            attributes: ["titulo", "imagenUrl"],
            include: [
                {
                    attributes: ["fecha"],
                    model: DetallesEventos,
                    as: "detallesevento",
                },
            ],
        });        
        if (result.length !== 0) {
            const resultObject = result.map(ro =>{
                return Object.assign({},{
                    titulo: ro.titulo,
                    imagenUrl: ro.imagenUrl,
                    fecha: result[0].detallesevento.fecha
                });                
            });                        
            const respuesta = `Iré al ${resultObject[0].titulo} @ ${resultObject[0].fecha} ${resultObject[0].imagenUrl}`            
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
            attributes: ["titulo", "descripcion", "destacado", "imagenUrl"],
            include: [
                {
                    attributes: ["fecha", "hora", "precio"],
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
            attributes: ["titulo", "descripcion", "imagenUrl"],
            include: [
                {
                    attributes: ["fecha", "hora", "precio"],
                    model: DetallesEventos,
                    as: "detallesevento",
                },
            ],
            order: [
                ["detallesevento", "fecha", "desc"],
                ["detallesevento", "hora", "desc"],
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
    const { titulo, descripcion, destacado, imagenUrl, latitud, longitud, fecha, hora, precio } = req.body;
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
            descripcion,
            destacado,
            imagenUrl,
            latitud,
            longitud,
            usuarioId: usuario.id
        }
        const eventoCreado = await Eventos.create(nuevoEvento);
        if (eventoCreado != null) {
            const eventoId = eventoCreado.id;
            const nuevaFecha = {
                fecha,
                hora,
                precio,
                eventoId
            }
            const fechaCreada = await DetallesEventos.create(nuevaFecha);
            if(fechaCreada != null) {
                const result = { ...eventoCreado.dataValues,...fechaCreada.dataValues }
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
                usuarioId: decodedToken.id,
            },
            attributes: ["titulo", "descripcion", "imagenUrl"],
            include: [
                {
                    attributes: ["fecha", "hora", "precio"],
                    model: DetallesEventos,
                    as: "detallesevento",
                },
            ],
            order: [
                ["detallesevento", "fecha", "desc"],
                ["detallesevento", "hora", "desc"],
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