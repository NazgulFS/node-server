require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/usuario', (req, res) => {
    res.json('Get usuario');
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    if(body.nombre === undefined){
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    } else {
        res.status(201)
        res.send({ body });
    }
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id

    res.send({
        id
    });
});

app.delete('/usuario', (req, res) => {
    res.send('delete a usuario');
});



app.listen(process.env.PORT, () => {
    console.log('Listening on: ', process.env.PORT);
});