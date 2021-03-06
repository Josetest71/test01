const { CleanPlugin } = require('webpack');
const Proyectos = require('../model/Proyecto');
const Tareas = require('../model/Tareas');

exports.agregarTarea = async (req, res, next) => {
    // Obtener proyecto actual
    const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });

    //Leer el valor del input
    const { tarea } = req.body;

    // estado 0 = incompleto y ID de proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    //Insertar en la base de datos
    const resultado = await Tareas.create({ tarea, estado, proyectoId });

    if (!resultado) {
        return next();
    }

    //redireccionar

    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async (req, res, next) => {
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id } });

    // Cambiar estado
    let estado = 0;
    if (tarea.estado == estado) {
        estado = 1;
    }
    tarea.estado = estado;
    const resultado = await tarea.save();
    if (!resultado) return next();

    res.status(200).send('Actualizado :D');
}

exports.eliminarTarea = async (req, res) => {
    const { id } = req.params
    //Eliminar la tarea
    const resultado = await Tareas.destroy({ where: { id } });

    if (!resultado) return next();

    res.status(200).send('Tarea eliminada correctamente!');
}