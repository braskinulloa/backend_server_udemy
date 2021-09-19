const express = require('express');

const app = express();

const Medico = require('../models/medico');

//Middelwares
const mdAutenticacion = require('../middlewares/autenticacion');

/**
 * Obtener todos los medicos
 */
app.get('/', (req, res, next)=>{
    const desde = req.params.desde || 0;
    const hasta = req.params.hasta || 5;
    Medico.find({}, 'nombre img usuario hospital')
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email') //Para devolver el objeto con el usuario
        .populate('hospital') 
        .exec(
            (error, medicos) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: error
                });
            }
            Medico.count({}, (err, cont) => {
                return res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: cont
                });
            });
        });
});

/**
 * Actualizar medico
 */
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Medico.findById(id).exec((error, medico) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: error
            });
        }
        medico.nombre = body.nombre;
        medico.usuario = body.usuario;
        medico.hospital = body.hospital;
    
        medico.save()
        .then((medicoActualizado) => {
            return res.status(200).json({
                ok: true,
                medico: medicoActualizado
            });
        })
        .catch((error) => {
            res.status(400).json({
                ok: false,
                mensaje: 'Error al actualizar medico',
                errors: error
            });
        });
    });

});

/**
 * Eliminar medico
 */
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndDelete(id).exec((error, medico) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: error
            });
        }
        if(!medico) {
            return res.status(202).json({
                ok: false,
                mensaje: 'Error al buscar medico, el id no cohincide con ninguno existente',
                error: { mensaje: 'Error al buscar medico, el id no cohincide con ninguno existente'}
            });
        }
        return res.status(200).json({
            ok: true,
            mensaje: 'Medico eliminado',
            medico: medico
        });
    });

});
/**
 * Crear un nuevo medico
 */
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        usuario: body.usuario,
        hospital: body.hospital
        });
        medico.save().then((medicoGuardado) => {
        return res.status(201).json({
                ok: true,
                medico: medicoGuardado,
                usuarioToken: res.usuarioToken
            });
        })
        .catch((error) => {
            res.status(400).json({
                ok: false,
                mensaje: 'Error creando medico',
                errors: error
            });
        });
    });

module.exports = app;