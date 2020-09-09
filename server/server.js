require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const corss = require('cors');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Le digo a mi front, que es seguro
app.use(corss());

// parse application/json ... 
app.use(bodyParser.json());

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));
//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../uploads/inmuebles')));
app.use(express.static(path.resolve(__dirname, '../uploads/archivos')));

//Configuración de rutas
app.use(require('./routes/index'));

// app.use('/login', express.static('./public'));
// app.use('/home', express.static('./public'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(console.log('Base de datos ONLINE'))
    .catch(err => {
        console.log(err);
    });


//Callback
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});