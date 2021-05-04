const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');
const tareasController = require('../controller/tareasControllers');
const usuariosController = require('../controller/usuariosController');
const authController = require('../controller/authController');

const { body } = require('express-validator');

module.exports = function() {
    router.get('/', authController.usuarioAutenticado ,controller.proyectosHome);
    router.get('/nuevo-proyecto', authController.usuarioAutenticado, controller.proyectos);
    router.post('/nuevo-proyecto', authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        controller.nuevoProyecto
        );

    // Confirmar cuenta
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);
 
    
    //Listar proyectos
    router.get('/proyectos/:url', authController.usuarioAutenticado, controller.proyectoUrl);

    // Actualizar el proyecto
    router.get('/proyecto/editar/:id', authController.usuarioAutenticado, controller.formularioEditar)
    router.post('/nuevo-proyecto/:id', authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        controller.actualizarProyecto
    )

    // Eliminar proyecto

    router.delete('/proyectos/:url',authController.usuarioAutenticado, controller.eliminarProyecto);
    router.post('/proyectos/:url', authController.usuarioAutenticado, tareasController.agregarTarea);

    // Actualizar tarea
    router.patch('/tareas/:id', authController.usuarioAutenticado, tareasController.cambiarEstadoTarea);
    router.delete('/tareas/:id', authController.usuarioAutenticado, tareasController.eliminarTarea)

    // Crear cuenta

    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);

    //Iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    // Cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion)

    // Reestablecer contraseña
    router.get('/reestablecer', usuariosController.formReestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);

    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);
    
    
    return router;
}