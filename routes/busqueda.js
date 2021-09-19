//Requires
const express = require('express');
const hospital = require('../models/hospital');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

//Inicializar variables
var app = express();

/**
 * Busqueda por coleccion
 */
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = String(req.params.tabla).toLowerCase();
    var busqueda = req.params.busqueda;
    var regexBusqueda = new RegExp(busqueda, 'i');
    var promesa;
    switch (tabla) {
        case 'medicos':
            promesa = buscarMedicos(busqueda, regexBusqueda);
            break;
            case 'hospitales':
            promesa = buscarHospitales(busqueda, regexBusqueda);
            break;
            case 'usuarios':
            promesa = buscarUsuarios(busqueda, regexBusqueda);
            break;
    
        default:
            res.status(500).json({
                ok: true,
                mensaje: 'No existe la coleccion'
            });
            break;
    }
    promesa.then( data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    })
    .catch( err => {
        res.status(500).json({
            ok: true,
            error: err
        });
    });
});

/**
 * Busqueda general
 */
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex),
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        })
        .catch( error => {
            res.status(500).json({
                ok: false,
                error: error
            });
        });
});

function buscarHospitales(busqueda, regex){
    return new Promise((resolve, reject) => {
        Hospital.find({nombre: regex })
        .populate('usuario', 'nombre email role')
        .exec((err, hospitales)=> {
            if (err) {
                reject('Error al buscar hospitales ', err);
            } else {
                resolve(hospitales);
            }
        });
    });
}
function buscarMedicos(busqueda, regex){
    return new Promise((resolve, reject) => {
        Medico.find({nombre: regex })
            .populate('usuario', 'nombre email role')
            .populate('hospital', 'nombre')
            .exec((err, medicos)=> {
            if (err) {
                reject('Error al buscar medicos ', err);
            } else {
                resolve(medicos);
            }
        });
    });
}

function buscarUsuarios(busqueda, regex){
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email img role').or(
            [{'nombre': regex}, {'email': regex}]
            ).exec((err, usuarios)=> {
            if (err) {
                reject('Error al buscar usuarios ', err);
            } else {
                resolve(usuarios);
            }
        });
    });
}

module.exports = app;