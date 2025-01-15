const Atirst = require("../models/artits")

const prueba = (req, res) => {
    return res.status(200).send('Modulo de prueba de artirts');
}

module.exports = {
    prueba,
}