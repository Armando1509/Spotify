const Abums = require('../models/albums');

const prueba = (req, res) => {
    return res.status(200).send('Modulo de prueba album');
}

module.exports = {
    prueba,
}