const mongoose = require('mongoose');
const mongooseValidation = require('mongoose-beautiful-unique-validation');

var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario'},
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El hospital id es un campo obligatorio']}
}, { collection: 'medicos'});

// usuarioSchema.plugin(mongooseValidation, { message: '{PATH}' }); 

module.exports = mongoose.model('Medico', medicoSchema);