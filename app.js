//Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Inicializar variables
var app = express();

//Body-Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

//Importar rutes
var appRoutes = require('./routes/routes');
var usuariosRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

//Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) {
        throw err;
    }
    console.log('Database on port 27017: \x1b[32m%s\x1b[0m', 'online');
});

//Rutas
app.use('/usuario', usuariosRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

//Escuchar peticiones
app.listen(3000, ()=>{
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m', 'online');
});