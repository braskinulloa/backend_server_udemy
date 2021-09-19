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
var hospitalesRoutes = require('./routes/hospital');
var medicosRoutes = require('./routes/medico');
var loginRoutes = require('./routes/login');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

//Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) {
        throw err;
    }
    console.log('Database on port 27017: \x1b[32m%s\x1b[0m', 'online');
});

//Server index
let serveIndex = require('serve-index');
app.use('/uploads', express.static('uploads'), serveIndex('uploads', {'icons': true}));
//Rutas
app.use('/usuario', usuariosRoutes);
app.use('/hospital', hospitalesRoutes);
app.use('/medico', medicosRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);

//Escuchar peticiones
app.listen(3000, ()=>{
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m', 'online');
});