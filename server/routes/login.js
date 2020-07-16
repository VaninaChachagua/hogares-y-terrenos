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


module.exports = app;