//Importamos las dependencias
const express = require('express');
const router = express.Router();

//Importamos los controladores
const eventosController = require('../controllers/eventosController');
const fechaEventosController = require('../controllers/fechaEventosController');
const usuariosController = require('../controllers/usuariosController');

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

//Rutas Eventos
router.get('/eventos',eventosController.getEventos);

//Rutas Fecha Eventos
router.get('/fechaeventos',fechaEventosController.getFechaEventos);

//Rutas Usuarios
router.get('/usuarios',usuariosController.getUsuario);

module.exports = router;