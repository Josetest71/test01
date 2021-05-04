const Proyectos = require('../model/Proyecto');
const Tareas = require('../model/Tareas');

exports.proyectosHome = async (req, res) => {

    //console.log(res.locals.usuario);

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });

    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos,
    });
}

exports.proyectos = async (req, res) => {
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({ where: { usuarioId } });
    res.render('nuevo-proyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });
    // Enviar a la consola lo que el usuario escriba.
    //console.log(req.body);

    // Validar que tengamos algo en el input

    const { nombre } = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un nombre al proyecto.' });
    }

    // Si hay errores

    if (errores.length > 0) {
        res.render('nuevo-proyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // No hay errores.
        // Insertar en la BD.
        //const url = slug(nombre).toLowerCase();
        const proyecto = await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
    }
}

exports.proyectoUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    // Consultar tareas del proyecto actual

    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        include: [
            { model: Proyectos }
        ]
    })

    console.log(tareas);

    if (!proyecto) return next();


    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas,
    })
}

exports.formularioEditar = async (req, res) => {
    //Render a la vista
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    })
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevo-proyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto,
    })
}

exports.actualizarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });
    // Enviar a la consola lo que el usuario escriba.
    //console.log(req.body);

    // Validar que tengamos algo en el input

    const { nombre } = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un nombre al proyecto.' });
    }

    // Si hay errores

    if (errores.length > 0) {
        res.render('nuevo-proyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // No hay errores.
        // Insertar en la BD.
        //const url = slug(nombre).toLowerCase();
        const proyecto = await Proyectos.update(
            { nombre: nombre },
            { where: { id: req.params.id } }
        );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    const { urlProyecto } = req.query;
    const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });
    if (!resultado) return next();
    res.send('El proyecto se ha eliminado.');

}