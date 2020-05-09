const jwt = require('jsonwebtoken');


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

    let usuario = req.usuario;

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
    verificaTokenImg
};