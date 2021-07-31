//Importamos las dependencias
const Eventos = require("../models/Eventos");
const FechaEventos = require("../models/FechaEventos");

/***************** VISITANTE ******************/

// Listar todos los eventos ordenados por fecha
exports.getEventos = async (req, res) => {
    try {
        const result = await Eventos.findAll({
            attributes: ["titulo", "descripcion", "destacado", "imagenUrl"],
            include: [
                {
                    attributes: ["fecha", "hora", "precio"],
                    model: FechaEventos,
                    as: "fechaevento",
                },
            ],
            order: [
                ["fechaevento", "fecha", "desc"],
                ["fechaevento", "hora", "desc"],
            ]
        });

        if (result.length !== 0) {
            return res.status(200).json(result);
        } else {
            return res.status(204).json({
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
                    model: FechaEventos,
                    as: "fechaevento",
                },
            ],
        });
        if (result.length !== 0) {
            const resultObject = result.map(ro =>{
                return Object.assign({},{
                    titulo: ro.titulo,
                    imagenUrl: ro.imagenUrl,
                    fecha: result[0].fechaevento.fecha
                });                
            });            
            const respuesta = `Iré al ${resultObject[0].titulo} @ ${resultObject[0].fecha} ${resultObject[0].imagenUrl}`            
            return res.status(200).json(respuesta);
        } else {
            return res.status(204).json({
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
                    model: FechaEventos,
                    as: "fechaevento",
                },
            ],
        });
        if (result.length !== 0) {
            return res.status(200).json(result);
        } else {
            return res.status(204).json({
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
                    model: FechaEventos,
                    as: "fechaevento",
                },
            ],
            order: [
                ["fechaevento", "fecha", "desc"],
                ["fechaevento", "hora", "desc"],
            ],
        });
        if (result.length !== 0) {
            return res.status(200).json(result);
        } else {
            return res.status(204).json({
                Error: "No existen eventos destacados.",
            });
        }
    } catch (error) {
        return res.status(404).json(error);
    }
};

/***************** USUARIO REGISTRADO ******************/

// Crear un evento  ************ NO ESTA TERMINADO
exports.createEvento = async (req, res) => {
    const { titulo, descripcion, destacado, imagenUrl, usuarioId } = req.body;
    try {
        const result = await Eventos.create({
            titulo,
            descripcion,
            destacado,
            imagenUrl,
            usuarioId,
        });
        if (result != null) {
            return res.status(200).json(result.dataValues);
        } else {
            return res.status(204).json({
                Error: "No se pudo realizar el registro",
            });
        }
    } catch (error) {
        console.log(error);
    }
};
