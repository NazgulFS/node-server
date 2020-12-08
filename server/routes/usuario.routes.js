const express = require('express');
const app = express();
const Usuario = require('../models/usuario.models');
const bcrypt = require('bcrypt');
const _= require('underscore');

app.get('/usuario', (req, res) => {
    // opcionales
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let cantidad = req.query.cantidad || 5;
    cantidad = Number(cantidad);

    Usuario.find({ estado: true }, 'name email role estado google img')
        .skip(desde)
        .limit(cantidad)
        .exec((err, usuarios) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cantidad: conteo
                });
            });

        })
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save( (err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

// Actualización de usuario
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'estado']); 

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true},(err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true, 
            usuario: usuarioDB
        });
    });
});

// Eliminar usuario
app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;

/*     en vez de eliminar usuario tambien podríamos
    hacer un update y cambiarle el estado a false 
    En este caso eliminamos el usuario por id*/
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if(!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
});

module.exports = app;