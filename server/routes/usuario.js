const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');


const { verificaToken, verificaAdminRole } = require('../middleware/autentication');

app.get('/usuario', verificaToken, (req, res) => {
    Usuario.find({ estado: true }, 'nombre apellido email telefono1 telalternativo role estado google img') //Lo que yo quiero que busque
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


app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
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
    console.log(usuario);
    usuario.save((err, usuarioBD) => {
        // En caso de error
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });

});

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