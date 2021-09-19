const mongoose = require('mongoose');
const mongooseValidation = require('mongoose-beautiful-unique-validation');

var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario'}
}, { collection: 'hospitales'});

// usuarioSchema.plugin(mongooseValidation, { message: '{PATH}' }); 

module.exports = mongoose.model('Hospital', hospitalSchema);