//******************************
//          Puerto
//******************************
process.env.PORT = process.env.PORT || 3000;

//******************************
// *** Entorno ***//
//******************************
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//******************************
//      Base de datos
//******************************
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    //BD local
    urlDB = 'mongodb://localhost:27017/inmuebles';

} else {
    //BD nube
    urlDB = process.env.MONGO_URI;
}

//******************************
//      Vencimiento token
//******************************
process.env.CADUCIDAD_TOKEN = '48h';

//******************************
//      Seed token
//******************************
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
process.env.URLDB = urlDB;