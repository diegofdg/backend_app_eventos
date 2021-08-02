//Importamos las dependencias
const express = require('express');
const router = express.Router();

//Importamos los controladores
const eventosController = require('../controllers/eventosController');
const detallesEventosController = require('../controllers/detallesEventosController');
const usuariosController = require('../controllers/usuariosController');
const loginController = require('../controllers/loginController');

// Habilitamos el json parser de express
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

//Rutas Eventos
router.get('/eventos',eventosController.getEventos);
router.get('/compartirevento',eventosController.compartirEvento);
router.get('/eventos/:id',eventosController.getEventoById);
router.get('/eventosdestacados/',eventosController.getEventosDestacados);

//Rutas Fecha Eventos
//router.get('/detalleseventos',detallesEventosController.getFechaEventos); // ESTE TODAVIA NO USAR
//router.post('/detalleseventos',detallesEventosController.createFechaEvento); // ESTE TODAVIA NO USAR

//Rutas Login
router.get('/login',loginController.loginUsuario);

//Rutas Usuarios
router.get('/usuario/eventos/:page?',eventosController.getEventosUsuario);
router.post('/usuario',usuariosController.crearUsuario);
router.post('/usuario/eventos',eventosController.createEvento);

module.exports = router;