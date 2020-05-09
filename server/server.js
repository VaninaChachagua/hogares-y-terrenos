require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json ... 
app.use(bodyParser.json());

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//Configuración de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(console.log('Base de datos ONLINE'))
    .catch(err => {
        console.log(err);
    });


//Callback
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});