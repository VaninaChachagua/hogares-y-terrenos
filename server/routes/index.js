const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./inmueble'));
app.use(require('./upload'));
app.use(require('./imagenes'));

//Ruta genérica
express.Router().get('/login', (req, res) => { res.redirect('/login'); });
express.Router().get('/home', (req, res) => { res.redirect('/home'); });
express.Router().get('*', (req, res) => { res.redirect('/'); });

module.exports = app;