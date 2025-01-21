const Atirst = require("../models/artits");
const { param } = require("../routes/artirts");

const prueba = (req, res) => {
  return res.status(200).send("Modulo de prueba de artirts");
};

// funcion para guardar un artista

const save = async (req, res) => {
  // traer datos del body
  let params = req.body;

  // comprobar si llegan los datos
  if (!params.name) {
    return res.status(400).send({ error: "El nombre es obligatorio" });
  }

  try {
    // ver si ya existe el artista
    params.name = params.name.toLowerCase();
    let artits = await Atirst.find({ $or: [{ name: params.name }] });
    if (artits && artits.length >= 1) {
      return res.status(400).send({ error: "El artista ya existe" });
    } else {
      // crear objeto de artista
      let artits = new Atirst(params);
      // guardar en la base de datos
      let artitsStored = await artits.save();
      // devolver resultado
      return res.status(200).send({
        status: "success",
        message: "Todo salio bien",
        artits: artitsStored,
      });
    }
  } catch (error) {
    return res.status(500).send({ error: "esto esta muerto" });
  }
};

module.exports = {
  prueba,
  save,
};
