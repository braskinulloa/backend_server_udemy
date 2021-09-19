const express = require('express');
const path = require('path');
const fs = require('fs');

let app = express();


let Usuario = require('../models/usuario');
let Hospital = require('../models/hospital');
let Medico = require('../models/medico');

app.get('/:tipo/:imagen', (req, res, next)=>{
    let tipo = req.params.tipo;
    let nombreImagen = req.params.imagen;

    let imgPath = path.resolve(__dirname, `../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath);
    } else {
        let noImgPath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImgPath);
    }
});

module.exports = app;