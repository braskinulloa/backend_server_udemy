const express = require('express');

const app = express();

//Encriptado de contraseñas
const bcript = require('bcrypt');
const saltRounds = 10;

const Usuario = require('../models/usuario');

//Middelwares
const mdAutenticacion = require('../middlewares/autenticacion');

/**
 * Obtener todos los usuarios
 */
app.get('/', (req, res, next)=>{
    Usuario.find({}, 'nombre email img role')
        .exec(
            (error, usuarios) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: error
                });
            }
            return res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        });
});

/**
 * Actualizar usuario
 */
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id).exec((error, usuario) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        
        usuario.save()
        .then((usuarioActualizado) => {
            usuarioActualizado.password = ':)';
            return res.status(200).json({
                ok: true,
                usuario: usuarioActualizado
            });
        })
        .catch((error) => {
            res.status(400).json({
                ok: false,
                mensaje: 'Error al actualizar usuario',
                errors: error
            });
        });
    });

});

/**
 * Eliminar usuario
 */
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Usuario.findByIdAndDelete(id).exec((error, usuario) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }
        if(!usuario) {
            return res.status(202).json({
                ok: false,
                mensaje: 'Error al buscar usuario, el id no cohincide con ninguno existente',
                error: { mensaje: 'Error al buscar usuario, el id no cohincide con ninguno existente'}
            });
        }
        usuario.password = ':(';
        return res.status(200).json({
            ok: true,
            mensaje: 'Usuario eliminado',
            usuario: usuario
        });
    });

});
/**
 * Crear un nuevo usuario
 */
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    bcript.hash(body.password, saltRounds, (error, hash) => {
        if (error) {
            res.status(400).json({
                ok: false,
                mensaje: 'Error en el password',
                errors: error
            });
        }
        var usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: hash,
            img:body.img,
            role: body.role
        });
        
        usuario.save()
        .then((usuarioGuardado) => {
            usuarioGuardado.password = ':)';
            return res.status(201).json({
                        ok: true,
                        usuario: usuarioGuardado,
                        usuarioToken: res.usuarioToken
                    });
        })
        .catch((error) => {
            res.status(400).json({
                ok: false,
                mensaje: 'Error creando usuario',
                errors: error
            });
        });
    });
});

module.exports = app;