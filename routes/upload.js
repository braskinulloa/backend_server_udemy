const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');//fileSystem

let Usuario = require('../models/usuario');
let Medico = require('../models/medico');
let Hospital = require('../models/hospital');

let app = express();

app.use(fileUpload());

app.get('/', (req, res, next)=>{
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

app.put('/:tipo/:id', (req, res, next)=>{
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subieron imágenes'
        });
    }
    let file = req.files.imagen;
    let arrNombre = file.name.split('.');
    let extensionArchivo = arrNombre[arrNombre.length - 1];
    const extensionesValidas = ['jpg', 'png', 'gif', 'jpge'];
    const tiposValidos = ['medicos', 'usuarios', 'hospitales'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: `La extensión ${extensionArchivo} no es válida`,
            errors: { mensaje: 'Las extensiones válidas son '+ extensionesValidas.join(', ') }
        });
    }
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: `El tipo "${tipo}" no es válido`,
            errors: { mensaje: 'Los tipos váidos son '+ tiposValidos.join(', ') }
        });
    }
    // nombre archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
    // mover archivo
    uploadPath = `./uploads/${tipo}/${nombreArchivo}`;
    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);
    });

});

function subirPorTipo(tipo, idModelo, nombreArchivo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(idModelo, (err, usuario) => {
            if (err || !usuario) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'El usuario no existe',
                    error: err
                });
            }
            let pathViejo = './uploads/usuarios/'+usuario.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        res.status(500).json({
                            ok: false,
                            mensaje: 'Error borrando archivo',
                            error: err
                        });
                    }
                });
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Fallo en actualización del usuario',
                        error: err
                    });
                }
                usuarioActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen subida correctamente',
                    usuario: usuarioActualizado
                });
            });
        });
    }
    if (tipo === 'medicos') {
        Medico.findById(idModelo, (err, medico) => {
            if (err || !medico) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'El medico no existe',
                    error: err
                });
            }
            let pathViejo = './uploads/medicos/'+medico.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        res.status(500).json({
                            ok: false,
                            mensaje: 'Error borrando archivo',
                            error: err
                        });
                    }
                });
            }
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Fallo en actualización del medico',
                        error: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen subida correctamente',
                    medico: medicoActualizado
                });
            });
        });
    }
    if (tipo === 'hospitales') {
        Hospital.findById(idModelo, (err, hospital) => {
            if (err || !hospital) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'El hospital no existe',
                    error: err
                });
            }
            let pathViejo = './uploads/hospitales/'+hospital.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        res.status(500).json({
                            ok: false,
                            mensaje: 'Error borrando archivo',
                            error: err
                        });
                    }
                });
            }
            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Fallo en actualización del hospital',
                        error: err
                    });
                }
                hospitalActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen subida correctamente',
                    hospital: hospitalActualizado
                });
            });
        });
    }
}

module.exports = app;