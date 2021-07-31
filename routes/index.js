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
router.get('/eventocompartir',eventosController.compartirEvento);
router.get('/eventos/:id',eventosController.getEventoById);
router.get('/eventosdestacados/',eventosController.getEventosDestacados);
router.post('/eventos',eventosController.createEvento); // ESTE TODAVIA NO USAR

//Rutas Fecha Eventos
router.get('/fechaeventos',fechaEventosController.getFechaEventos); // ESTE TODAVIA NO USAR
router.post('/fechaeventos',fechaEventosController.createFechaEvento); // ESTE TODAVIA NO USAR

//Rutas Usuarios
router.get('/login',usuariosController.loginUsuario);

module.exports = router;