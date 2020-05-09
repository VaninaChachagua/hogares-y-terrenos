const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Inmueble = require('../models/inmueble');
app.use(fileUpload());
//app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }
    // Validar tipo
    let tiposValidos = ['inmuebles', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', ')
            }
        });
    }

    // el nombre con el que voy a hacer el post en el body
    let archivo = req.files.archivo;

    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreCortado = archivo.name.split('.');
    // Extensión
    let extension = nombreCortado[nombreCortado.length - 1];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }
    //Cambiar el nombre de archivo, único
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`./uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        console.log('antes de subirla a la base');
        //Imagen ya subida
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
            console.log('Entrando por usuario');
        } else {
            imagenInmueble(id, res, nombreArchivo);
        }


    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioBD) {
            if (err) {
                borraArchivo(nombreArchivo, 'usuarios');
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no existe'
                    }
                });
            }
        }

        borraArchivo(usuarioBD.img, 'usuarios');

        usuarioBD.img = nombreArchivo;
        usuarioBD.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
}

function borraArchivo(nombreImg, tipo) {
    //Validar ruta
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);
    //Validar si el path existe y borrarlo
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

function imagenInmueble(id, res, nombreArchivo) {

    Inmueble.findById(id, (err, inmuebleBD) => {
        if (err) {
            borraArchivo(nombreArchivo, 'inmuebles');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!inmuebleBD) {
            if (err) {
                borraArchivo(nombreArchivo, 'inmuebles');
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'inmueble no existe'
                    }
                });
            }
        }
        console.log('Encontré el archivo');
        borraArchivo(inmuebleBD.img, 'inmuebles');

        inmuebleBD.img = nombreArchivo;
        inmuebleBD.save((err, inmuebleGuardado) => {
            res.json({
                ok: true,
                inmueble: inmuebleGuardado,
                img: nombreArchivo
            });
        });
    });
}
module.exports = app;