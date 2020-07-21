const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const Inmueble = require('../models/inmueble');
const bcrypt = require('bcryptjs');
const _ = require('underscore');


const { verificaToken, verificaMail, verificaAdminRole } = require('../middleware/autentication');
const inmueble = require('../models/inmueble');

app.get('/usuario', verificaToken, (req, res) => {
    Usuario.find({ estado: true }, 'nombre apellido email telefono1 telalternativo role estado img') //Lo que yo quiero que busque
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
        });
});

// app.get('/usuario/:id', verificaToken, (req, res) => {
//     let mail = req.params.mail;

//     Usuario.findById(mail)
//         .exec((err, usuario) => {
//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     err
//                 });
//             }
//             if (!usuario) {
//                 return res.status(500).json({
//                     ok: false,
//                     message: 'No se encontró ese id usuario'
//                 });
//             }

//             res.json({
//                 ok: true,
//                 inmueble
//             });
//         });
// });

app.get('/usuario/:email', verificaToken, (req, res) => {
    let mail = req.params.mail;

    let regex = new RegExp(mail, 'i');

    Usuario.findOne({ email: regex })
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuarios
            });
        });
});
app.get('/usuarioid/:id', (req, res) => {
    let id = req.params.id;
    Usuario.findById(id)
        // .populate('inmueble', 'identificador')
        .exec((err, usuarioBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!inmueble) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se encontró ese id usuario'
                });
            }
            res.json({
                ok: true,
                usuarioBD
            });
        });

});

// app.post('/usuario', [verificaToken, verificaMail, verificaAdminRole], (req, res) => {
app.post('/usuario', [verificaMail], (req, res) => {
    // Busco los datos que se quieren utilizar para crear el usuario
    let body = req.body;

    // Armo el esquema y encripto la clave
    let usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        telefono1: body.telefono1,
        telalternativo: body.telalternativo,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
    usuario.save((err, usuarioBD) => {
        // En caso de error
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al intentar impactar en la base',
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });
});

function buscarInmuebles(listId) {
    listId.forEach(id => {
        Inmueble.findById(id, (err, inmuebleBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!inmuebleBD) {
                // Recordar borrar del array si no existe
            }
            // Ver si sigue solo
            // else {
            //     next();
            // }

        });
    });
}

function buscarInmueble(id) {
    Inmueble.findById(id, (err, inmuebleBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!inmuebleBD) {
            return res.status(400).json({
                ok: false,
                message: 'Ese inmueble no existe',
                err
            });
        }
    });
}

app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'apellido', 'img', 'role', 'estado', 'telefono1', 'telalternativo']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        console.log(err);
        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });


});

//Baja lógica
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;