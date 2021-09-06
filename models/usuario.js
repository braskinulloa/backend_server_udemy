const mongoose = require('mongoose');
const mongooseValidation = require('mongoose-beautiful-unique-validation');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message:'{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, required: [true, 'El correo es necesario'], unique: [true, 'El correo tiene que ser único'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String},
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos}
});

// usuarioSchema.plugin(mongooseValidation, { message: '{PATH}' }); 

module.exports = mongoose.model('Usuario', usuarioSchema);