const passport = require('passport');
const Usuario = require('../model/Usuario');
const crypto = require('crypto');
const Usuarios = require('../model/Usuario');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios.'
});

// Función para revisar si un usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
    // Si el usuario esta autenticado, adelante
    if (req.isAuthenticated()) {
        return next();
    }

    // Si no esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion') // Al cerrar sesion nos lleva al login
    });
}

// Genera un token si el correo existe
exports.enviarToken = async (req, res) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    // Si no existe

    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    // Usuario si existe :3

    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    
    // Guardarlos en la base de datos

    await usuario.save();

    // url de reset

    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    // Enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    req.flash('correcto', 'se ha enviado un correo para cambiar tu contraseña')
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });
    //Si no encuentra al usuario
    if (!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }

    // Formulario para generar nueva password
    res.render('reset-password', {
        nombrePagina: 'Reestablecer contraseña'
    })
    
    console.log(usuario);
}

exports.actualizarPassword = async (req, res) => {
    // Verifica el token valido, pero tambien la fecha de expiración.
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    })

    // Verificar si el usuario existe
    if (!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }

    // Hashear el password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    

    // guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}