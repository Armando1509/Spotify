const Atirst = require("../models/artits");
const fs = require("fs");
const path = require("path");

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

const update = async (req, res) => {
  let id = req.params.id;
  let params = req.body;
  try {
    let artits = await Atirst.findByIdAndUpdate(id, params, {new: true});
    
    if (!artits) {
      return res.status(404).send({ error: "El artista no existe" });
    } else {
        return res.status(200).send({ artits });
        }
  } catch (error) {
    return res.status(500).send({ error: "esto esta muerto" });
  }
}

const remove = async (req, res) => {
  // sacar el id del artista de la url
  let id = req.params.id;
  // hacer consulta para buscar y eliminar el artista
  try {
    let artits = await Atirst.findByIdAndDelete(id);
    if (!artits) {
      return res.status(404).send({ error: "El artista no existe" });
    } else {
        return res.status(200).send({ 
        status: "success",
        message: "El artista se ha eliminado",
        artits 
        });
        }
  } catch (error) {
    return res.status(500).send({ error: "esto esta muerto" });
  }
}

const upload = async (req, res) => {
  // configuracion de subida (multer)

  // recoger artist id
  let artistId = req.params.id;

  // Recoger fichero y comprobar si existe
  if (!req.file) {
    return res.status(404).send({ error: "La peticion no incluye imagen" });
  }
  // conseguir nombre del archivo
  let image = req.file.originalname;
  // sacar extension de la imagen
  let imageSplit = image.split(".");
  const extension = imageSplit[1];
  // comprobar extension (solo imagenes), si no es valida borrar archivo subido
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    // borrar archivo subido
    const filePath = req.file.path;
    const fileDelete = fs.unlinkSync(filePath);
    // devolver el error
    return res
      .status(400)
      .send({ error: "La extension de la imagen no es válida" });
  }
  // Si es correcto guardar imagen en la bbdd
  let imageArtist = await Atirst.findByIdAndUpdate(
    { _id: artistId },
    { image: req.file.filename },
    { new: true }
  );
  if (!imageArtist) {
    return res.status(500).send({ error: "Error al subir la imagen" });
  }
  return res.status(200).send({
    status: "success",
    message: "Método de upload",
    artist: imageArtist,
    file: req.file,
  });
};

const image = async (req, res) => {
// Sacar el parametro de la url
const file = req.params.file;

// montar el path real de la imagen
const filePath = path.resolve(__dirname, "../uploads/artists", file);

// comprobar si existe la imagen
fs.stat(filePath, (exists) => {
  if (exists) {
    return res.status(400).send({
      status: "Error",
      message: "does not exist",
      avatar: file,
    }) 
}
// devolver
return res.sendFile(filePath);
});
}
module.exports = {
  prueba,
  save,
  one,
  list,
  update,
  remove,
  upload,
  image,
};
