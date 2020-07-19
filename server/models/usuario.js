const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// puedo hacer rol Administrador y locatario
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es necesario']
    },
    email: {
        type: String,
        required: [true, 'El mail es requerido'],
        unique: true
    },
    telefono1: {
        type: Number,
        required: [true, 'El telefono/celular es requerido']
    },
    //Número alternativo
    telalternativo: {
        type: Number,
        required: false
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        //el rol debe existir en la enumeración
        enum: rolesValidos
    },
    // inmueble: {
    //     type: Array,
    //     default: [],
    //     // Puedo hacer que no sea obligatorio si lo hago vacío VER
    //     required: true
    // },
    estado: {
        type: Boolean,
        default: true
    } //,
    // google: {
    //     type: Boolean,
    //     default: false
    // } Sirve si quiero armar el logueo con cuenta de google
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;

};

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);