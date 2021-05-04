const Usuarios = require('../model/Usuario');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crear cuenta en uptaks'
    })
}

exports.crearCuenta = async (req, res) => {
    //Leer los datos
    const { email, password } = req.body
    
    try {
        await Usuarios.create({
            email,
            password
        });

        // Crear una URL de confirmar
        const confirmUrl = `http://${req.headers.host}/confirmar/${email}`; 

        // Crear el objecto de usuario
        const usuario = {
            email
        }

        // Enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar tu cuenta UpTask',
            confirmUrl,
            archivo: 'confirmar-cuenta'
        });

        // Redirigir al usuario
        req.flash('correcto', 'Enviamos un correo de confirmación!')
        res.redirect('/iniciar-sesion');

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crear-cuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en UpTask',
            email,
            password            
        });
    }
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesion en UpTask',
        error
    })
}

exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu contraseña.'
    })
}

exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
       where: {
           email: req.params.correo
       } 
    });

    // Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente!');
    res.redirect('/iniciar-sesion');
}