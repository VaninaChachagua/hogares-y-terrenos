const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const app = express();

//mi usuario de logueo es el mail
app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }
        let token = jwt.sign({
            usuario: usuarioBD
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        //expira en 48h
        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        });
    });

});

// Obtener id también
app.get('/obtenerRolePorToken/:tk', (req, res) => {
    const tk = req.params.tk;
    jwt.verify(tk, process.env.SEED, (err, decoded) => {
        if (err) {
            res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        } else {
            res.status(200).json({
                ok: true,
                message: 'Token OK',
                role: decoded.usuario.role
            });
        }
    });
});

//Actualizar inmueble
// app.put('/inmueble/:id', verificaToken, (req, res) => {
//     let body = req.body;
//     let id = req.params.id;

//     Inmueble.findById(id, (err, inmuebleBD) => {
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 err
//             });
//         }
//         if (!inmuebleBD) {
//             return res.status(400).json({
//                 ok: false,
//                 message: 'No se encontró ese id inmueble'
//             });
//         }
//         inmuebleBD.identificador = body.identificador;
//         inmuebleBD.precio = body.precio;
//         inmuebleBD.moneda = body.moneda;
//         inmuebleBD.direccion = body.direccion;
//         inmuebleBD.barrio = body.barrio;
//         inmuebleBD.descripcion = body.descripcion;
//         inmuebleBD.cantHab = body.cantHab;
//         inmuebleBD.tipoInmueble = body.tipoInmueble;
//         inmuebleBD.tipoVenta = body.tipoVenta;
//         inmuebleBD.usuario = req.usuario._id;
//         inmuebleBD.visitas = body.visitas;
//         inmuebleBD.fechaAlta = new Date();

//         inmuebleBD.save((error, inmuebleGuardado) => {
//             if (error) {
//                 return res.status(500).json({
//                     ok: false,
//                     error
//                 });
//             }
//             res.json({
//                 ok: true,
//                 inmueble: inmuebleGuardado
//             });
//         });

//     });
// });

module.exports = app;