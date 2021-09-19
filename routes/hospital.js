const express = require('express');

const app = express();

const Hospital = require('../models/hospital');

//Middelwares
const mdAutenticacion = require('../middlewares/autenticacion');

/**
 * Obtener todos los hospitales
 */
app.get('/', (req, res, next)=>{
    const desde = req.params.desde || 0;
    const hasta = req.params.hasta || 5;
    Hospital.find({}, 'nombre img usuario')
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email')
        .exec(
            (error, hospitales) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: error
                });
            }
            Hospital.count({}, (err, cont) => {
                return res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: cont
                });
            });
        });
});

/**
 * Actualizar hospital
 */
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Hospital.findById(id).exec((error, hospital) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: error
            });
        }
        hospital.nombre = body.nombre;
        hospital.usuario = body.usuario;
    
        hospital.save()
        .then((hospitalActualizado) => {
            return res.status(200).json({
                ok: true,
                hospital: hospitalActualizado
            });
        })
        .catch((error) => {
            res.status(400).json({
                ok: false,
                mensaje: 'Error al actualizar hospital',
                errors: error
            });
        });
    });

});

/**
 * Eliminar hospital
 */
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndDelete(id).exec((error, hospital) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: error
            });
        }
        if(!hospital) {
            return res.status(202).json({
                ok: false,
                mensaje: 'Error al buscar hospital, el id no cohincide con ninguno existente',
                error: { mensaje: 'Error al buscar hospital, el id no cohincide con ninguno existente'}
            });
        }
        return res.status(200).json({
            ok: true,
            mensaje: 'Hospital eliminado',
            hospital: hospital
        });
    });

});
/**
 * Crear un nuevo hospital
 */
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: body.usuario
        });
        hospital.save().then((hospitalGuardado) => {
        return res.status(201).json({
                ok: true,
                hospital: hospitalGuardado,
                usuarioToken: res.usuarioToken
            });
        })
        .catch((error) => {
            res.status(400).json({
                ok: false,
                mensaje: 'Error creando hospital',
                errors: error
            });
        });
    });

module.exports = app;