// importar modulos
const User = require('../models/users');

// modulo de prueba
const prueba = (req, res) => {
    return res.status(200).send('Modulo de prueba');
}

module.exports = {
    prueba,
}