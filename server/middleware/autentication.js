const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

//******************************
//      Verificar token
//******************************
//next continua con la ejecución del programa
let verificaToken = (req, res, next) => {
    let token = req.get('token');
    console.log(token);
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

    Usuario.findOne({ email: mail })
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            console.log(usuarios);
            if (usuarios) {
                res.status(400).json({
                    ok: false,
                    message: 'Ese mail ya existe'
                });
            } else {
                next();
            }

        });

    // Usuario.findOne(mail)
    //     // .populate('inmueble', 'identificador')
    //     .exec((err, usuarioBD) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err
    //             });
    //         }
    //         if (!inmueble) {
    //             return res.status(500).json({
    //                 ok: false,
    //                 message: 'No se encontró ese id usuario'
    //             });
    //         }
    //         res.json({
    //             ok: true,
    //             usuarioBD
    //         });
    //     });
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