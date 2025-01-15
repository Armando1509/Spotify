const Songs = require("../models/songs")

const prueba = (req, res) => {
    return res.status(200).send('Modulo de prueba de songs');
}

module.exports = {
    prueba
}