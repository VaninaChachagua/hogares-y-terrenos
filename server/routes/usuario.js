const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const Inmueble = require('../models/inmueble');
const bcrypt = require('bcryptjs');
const _ = require('underscore');


const { verificaToken, verificaMail, verificaAdminRole } = require('../middleware/autentication');
const inmueble = require('../models/inmueble');

app.get('/usuario', verificaToken, (req, res) => {
    Usuario.find({ estado: true }, 'nombre apellido email telefono1 telalternativo role estado img inmueble') //Lo que yo quiero que busque
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (usuarios.length === 0) {
                return res.status(404).json({
                    ok: false,
                    message: 'No existen usuarios para mostrar'
                });
            }
            if (usuarios.inmueble && usuarios.inmueble.length > 0)
                usuarios.inmueble.forEach((inm, index) => {
                    Inmueble.findById(inm).exec((err, inmuebles) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                err
                            });
                        }
                        if (!inmuebles[0].disponible) usuarios.inmueble.splice(index, 1);
                    });
                });
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
        });
});


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
                usuarioBD,
                inmueble: usuarioBD.inmueble
            });
        });

});


app.put('/usuarioInmueble/:id', [verificaToken], (req, res) => {
    console.log('UsuarioInmueble');
    let id = req.params.id;
    let inmueble = req.body.inmuebles;
    console.log(req.body.inmuebles);
    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        usuarioBD.inmueble = inmueble;
        usuarioBD.save((error, inmuebleGuardado) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
            res.json({
                ok: true,
                usuario: usuarioBD
            });
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


app.put('/usuario/blanquearClave/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;
    const pwd = {
        password: bcrypt.hashSync('Clave123', 10)
    };
    Usuario.findByIdAndUpdate(id, pwd, { new: true }, (err, usuarioActualizado) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (!usuarioActualizado) res.status(400).json({
            ok: false,
            err: {
                message: 'usuario no encontrado'
            }
        });
        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
    });
});

app.put('/usuario/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'apellido', 'role', 'estado', 'telefono1', 'telalternativo']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {
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