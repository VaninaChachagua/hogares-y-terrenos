const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { verificaTokenImg } = require('../middleware/autentication');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/original.jpg');
        //Devuelve el objeto, mandándoselo al usuario, sea img o lo que sea
        res.sendFile(noImagePath);
    }

});



module.exports = app;