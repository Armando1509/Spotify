const Atirst = require("../models/artits");

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

const one = async (req, res) => {
  let id = req.params.id;
  try {
    let artits = await Atirst.findById(id);
    if (!artits) {
      return res.status(404).send({ error: "El artista no existe" });
    } else {
        return res.status(200).send({ artits });
        }
  } catch (error) {
    return res.status(500).send({ error: "esto esta muerto" });
  }
}

const list = async (req, res) => {
  // sacar la posible pagina
  let page = req.params.page
  if(req.params.page){
    page = req.params.page;
  }
  // definir numero de elementos por pagina
  let itemsPerPage = 5;
  // find, ordenarlo y paginarlo
  try {
    let total = await Atirst.countDocuments();
    let artits = await Atirst.find().sort('name').paginate(page, itemsPerPage);
    if (!artits) {
      return res.status(404).send({ error: "No hay artistas" });
    } else {
        return res.status(200).send({ 
        status: "success",
        artistas: artits,
        itemsPerPage,
        total,
        pages: Math.ceil(total/itemsPerPage)
         });
        }
  } catch (error) {
    return res.status(500).send({ error: "esto esta muerto" });
  }
  return res.status(200).send("Modulo de prueba de list");
}

module.exports = {
  prueba,
  save,
  one,
  list,
};
