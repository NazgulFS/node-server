const jwt = require('jsonwebtoken');

//=================
// VERIFICAR TOKEN
//=================

let verificarToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify( token, process.env.SEED, (err, decode) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                err:{
                    message: 'Token no válido'
                }
            });
        }
        // guardamos en usuario el payload con la propiedad usuario
        req.usuario = decode.usuario;
        next();
    });
};

//=====================
// VERIFICAR ADMIN_ROLE
//=====================

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if(usuario.role === 'ADMIN_ROLE') {
         next();   
    }else{
        res.json({
            ok:false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
}

module.exports = {
    verificarToken,
    verificaAdminRole
}