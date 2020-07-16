var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// puedo hacer rol Administrador y locatario
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};


var inmuebleSchema = new Schema({
    // No sé si llamarlo identificador o nombre, es la forma en la que voy a presentarlos en la pagina
    identificador: {
        type: String,
        required: [true, 'El nombre con el que quiere mostrar el inmueble es necesario']
    },
    precio: {
        type: Number,
        required: true, //[true, 'El precio del inmueble es necesario'] agregar moneda
        default: 0
    },
    moneda: {
        type: String,
        required: false, //[true, 'El precio del inmueble es necesario'] agregar moneda
        default: 'ars'
    },
    direccion: {
        type: String,
        required: [true, 'La direccion es necesaria']
    },
    barrio: {
        type: String,
        required: [true, 'El barrio es necesario']
    },
    descripcion: {
        type: String,
        required: false
    },
    cantHab: {
        type: String,
        required: false
    },
    img: {
        type: Array,
        required: false,
        default: ['vacio.png']
    },
    archivos: {
        type: Array,
        required: false
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    // El tipo de inmueble: casa, dpto,
    tipoInmueble: {
        type: String,
        required: [true, 'El tipo de inmueble es necesario']
    },
    // Si es alquiler o venta
    tipoVenta: {
        type: String,
        required: true
    },
    //usr -> quien lo cargó 
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    visitas: {
        type: Number,
        required: true
    },
    fechaAlta: {
        type: Date,
        required: true
    }
});



module.exports = mongoose.model('Inmueble', inmuebleSchema);