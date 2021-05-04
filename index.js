const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

const helpers = require('./helpers');

require('dotenv').config({ path: '.env' });


// Crear la conexión a la DB
const db = require('./config/db');

// Importar el Modelo
require('./model/Proyecto');
require('./model/Tareas');
require('./model/Usuario');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));

// Crear una app de express.
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar pug.
app.set('view engine', 'pug');

// Habilitar bodyParser para leer datos del formulario.
app.use(bodyParser.urlencoded({extended: true}))


// Añadir carpeta de vistas.
app.set('views', path.join(__dirname, 'view'));

// Agregar flash messages
app.use(flash());
app.use(cookieParser());

// Sesiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret: 'holasoyunsecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar var dump a la app
app.use((req, res, next) => { 
    res.locals.usuario = {...req.user} || null;
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    next();
});


app.use('/', routes());

// Servidor y puerto

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor esta corriendo correctamente.');
});

//require('./handlers/email');