const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo donde vamos a autenticar
const Usuarios = require('../model/Usuario');

// Local strategy - Login con credenciales propias (usuario / password)

passport.use(
    new LocalStrategy(
        // Por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email,
                        activo: 1
                    
                    }
                })
                // El usuario existe, pero el password es incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, { message: 'Password incorrecto'})
                }

                // El email existe, y el password es correcto
                return done(null, usuario);

            } catch (error) {
                // Ese usuario no existe
                return done(null, false, { message: 'Esa cuenta no existe.' });
            }
        }
    )  
);

// Serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

// Exportar

module.exports = passport;