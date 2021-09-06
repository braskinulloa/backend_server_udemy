const express = require('express');

const app = express();

//Encriptado de contraseñas
const bcript = require('bcrypt');
const saltRounds = 10;

const Usuario = require('../models/usuario');

//JSON WEB TOKEN
const jwt = require('jsonwebtoken');
const { SEED } = require('../config/config');

app.post('/', (req, res) => {
    const body = req.body;
    Usuario.findOne({ email: body.email }).exec((err, usuarioDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if(!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas -email',
                errors: err
            });
        }
        if (!bcript.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas -password',
                errors: err
            });
        }
        usuarioDB.password = ':)';
        //crear token
        const token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });//expira en 4 días
        //fin de token
        return res.status(200).json({
            ok: true,
            token: token,
            usuario: usuarioDB,
            id: usuarioDB._id
        });
    });
})

module.exports = app;
