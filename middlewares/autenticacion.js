const jwt = require('jsonwebtoken');
const { SEED } = require('../config/config');
/**
 * Middleware Verificar Token
*/
exports.verificaToken = (req, res, next) => {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }
        res.usuarioToken = decoded.usuario; 
        next();
    })
};