const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.models');

app.post('/login', (req, res) => {
    let body = req.body;

        // Email debe existir
    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB) {
            return res.status(500).json({
                ok: false,
                err:{
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario o contraseña incorrectos'
                }
            })
        }

        let token = jwt.sign({
            // usuarioDB esta la info
            usuario: usuarioDB
        }, process.env.SEED, {expiresIn: 60 * 60 * 24})

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    });
});

module.exports = app;