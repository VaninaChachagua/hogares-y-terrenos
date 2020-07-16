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
    console.log(req.body);
    let tipo = req.params.tipo;
    let id = req.params.id;
    const nombres = [];
    console.log(id);
    let cantidad = 0;
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
    let archivos = req.files.archivo;
    archivos.forEach(archivo => {
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
                nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`;
                archivo.mv(`./uploads/${tipo}/${nombreArchivo}`);
            }
            console.log('antes de subirla a la base');
            //Imagen ya subida
            if (tipo === 'usuarios') {
                imagenUsuario(id, res, nombreArchivo);
                console.log('Entrando por usuario');
            }
            nombres.push(nombreArchivo);

            cantidad++;
            if (tipo === 'inmuebles' && archivos.length == cantidad) {

                console.log(cantidad);
                console.log(nombres);

                imagenInmueble(id, res, nombres);
            }
        });

    });


});
app.put('/uploadarchivos/:tipo/:id', (req, res) => {
    console.log(req.body);
    let id = req.params.id;
    console.log(id);
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // el nombre con el que voy a hacer el post en el body
    let archivo = req.files.archivo;

    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'pdf'];
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
    let nombreArchivo = `${id}-${ new Date().getTime()}.${extension}`;

    archivo.mv(`./uploads/archivos/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        console.log('antes de subirla a la base');
        //Archivo ya subido
        pdfInmueble(id, res, nombreArchivo);
        console.log('Por guardar en base');

    });
});

function pdfInmueble(id, res, nombreArchivo) {
    Inmueble.findById(id, (err, inmuebleBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!inmuebleBD) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'inmueble no existe'
                    }
                });
            }
        }
        console.log('Encontré el archivo');
        if (!inmuebleBD.archivos) {
            inmuebleBD.archivos = [];
        }
        inmuebleBD.archivos.push(nombreArchivo);
        inmuebleBD.save((err, inmuebleGuardado) => {
            res.json({
                ok: true,
                inmueble: inmuebleGuardado,
                archivos: nombreArchivo
            });
        });
    });
}

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

function borraArchivo(nombreImgagenes, tipo) {
    nombreImgagenes.forEach(nombreImg => {
        //Validar ruta
        let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);
        //Validar si el path existe y borrarlo
        if (fs.existsSync(pathImg)) {
            fs.unlinkSync(pathImg);
        }
    });

}

function imagenInmueble(id, res, nombresArchivos) {

    Inmueble.findById(id, (err, inmuebleBD) => {
        if (err) {
            borraArchivo(nombresArchivos, 'inmuebles');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!inmuebleBD) {
            if (err) {
                borraArchivo(nombresArchivos, 'inmuebles');
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'inmueble no existe'
                    }
                });
            }
        }
        console.log('Encontré el archivo');
        if (!inmuebleBD.img) {
            inmuebleBD.img = [];
        }
        nombresArchivos.forEach(nombreArchivo => {
            inmuebleBD.img.push(nombreArchivo);
        });

        inmuebleBD.save((err, inmuebleGuardado) => {
            res.json({
                ok: true,
                inmueble: inmuebleGuardado,
                img: nombresArchivos
            });
        });
    });
}
module.exports = app;