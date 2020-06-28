const express = require('express');
const { verificaToken } = require('../middleware/autentication');

let app = express();
let Inmueble = require('../models/inmueble');

// Arreglar, debería traer un listado de inmuebles 
app.get('/inmueble', (req, res) => {
    Inmueble.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .exec((err, inmuebles) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                inmueble: inmuebles
            });
        });

});


// trae uno en específico
app.get('/inmueble/:id', (req, res) => {
    let id = req.params.id;

    Inmueble.findById(id)
        .populate('usuario', 'nombre email')
        .exec((err, inmueble) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!inmueble) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se encontró ese id inmueble'
                });
            }
            res.json({
                ok: true,
                inmueble
            });
        });

});

//Validar, es una busqueda por el identificador o nombre
app.get('/inmueble/buscar/:termino', (req, res) => {
    let termino = req.params.termino;
    //expresion regular
    let regex = new RegExp(termino, 'i');
    Inmueble.find({ identificador: regex })
        .exec((err, inmuebles) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                inmuebles
            });
        });
});



//Crear inmueble
app.post('/inmueble', (req, res) => {

    let body = req.body;
    let inmueble = new Inmueble({
        identificador: body.identificador,
        precio: body.precio,
        moneda: body.moneda,
        direccion: body.direccion,
        barrio: body.barrio,
        descripcion: body.descripcion,
        cantHab: body.cantHab,
        disponible: body.disponible,
        tipoInmueble: body.tipoInmueble,
        tipoVenta: body.tipoVenta,
        usuario: body.usuario,
        visitas: 0
    });
    inmueble.save((err, inmuebleBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            inmueble: inmuebleBD
        });
    });
});

//Actualizar inmueble
app.put('/inmueble/:id', verificaToken, (req, res) => {
    let body = req.body;
    let id = req.params.id;

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
                message: 'No se encontró ese id inmueble'
            });
        }
        inmuebleBD.identificador = body.identificador;
        inmuebleBD.precio = body.precio;
        inmuebleBD.moneda = body.moneda;
        inmuebleBD.direccion = body.direccion;
        inmuebleBD.barrio = body.barrio;
        inmuebleBD.descripcion = body.descripcion;
        inmuebleBD.cantHab = body.cantHab;
        inmuebleBD.tipoInmueble = body.tipoInmueble;
        inmuebleBD.tipoVenta = body.tipoVenta;
        inmuebleBD.usuario = req.usuario._id;
        inmuebleBD.visitas = body.visitas;

        inmuebleBD.save((error, inmuebleGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                inmueble: inmuebleGuardado
            });
        });

    });
});


//Actualizar inmueble
app.put('/inmueble/visitas/:id', (req, res) => {
    let body = req.body;
    let id = req.params.id;

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
                message: 'No se encontró ese id inmueble'
            });
        }
        inmuebleBD.visitas = body.visitas;

        inmuebleBD.save((error, inmuebleGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                inmueble: inmuebleGuardado
            });
        });

    });
});

//Borrar inmueble, disponible a falso
app.delete('/inmueble/:id', verificaToken, (req, res) => {

    let id = req.params.id;


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
                err: {
                    message: 'No se encontró ese id inmueble'
                }
            });
        }
        inmuebleBD.disponible = false;
        inmuebleBD.save((err, inmuebleBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                inmueble: inmuebleBorrado,
                mensaje: 'Inmueble Borrado'
            });
        });

    });
});

module.exports = app;