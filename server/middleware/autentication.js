const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

//******************************
//      Verificar token
//******************************
//next continua con la ejecución del programa
let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });
};
//******************************
//      Verificar AdminRole
//******************************
//next continua con la ejecución del programa
let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario.role;
    console.log(usuario);
    if (usuario === 'ADMIN_ROLE') {
        next();

    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Rol no válido'
            }
        });
    }
};
//******************************
//      Verificar Mail
//******************************
//next continua con la ejecución del programa
let verificaMail = (req, res, next) => {

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

            if (Object.keys(usuarios).length != 0) {
                res.status(400).json({
                    ok: false,
                    message: 'Ese mail ya existe'
                });
            }


        });
};


//*****************************************
//      Verificar token para Imagen
//*****************************************
//next continua con la ejecución del programa
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};
module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaMail,
    verificaTokenImg
};