const Album = require("../models/albums");
const Song = require("../models/songs");
const fs = require("fs");
const path = require("path");

const prueba = (req, res) => {
  return res.status(200).send("Modulo de prueba album");
};

const save = async (req, res) => {
  //sacar los parametros de la peticion
  let params = req.body;
  let album = new Album(params);

  // guardar objeto en la base de datos
  try {
    let albumStored = await album.save();
    if (!albumStored) {
      return res.status(404).send({
        status: "error",
        message: "El album no se ha guardado",
      });
    } else {
      return res.status(200).send({
        status: "success",
        album: albumStored,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al guardar el album",
    });
  }
};

const one = async (req, res) => {
  let albumId = req.params.id;

  try {
    let album = await Album.findById(albumId).populate("artist");

    if (!album) {
      return res.status(404).send({
        status: "error",
        message: "El album no existe",
      });
    } else {
      return res.status(200).send({
        status: "success",
        album,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al buscar el album",
    });
  }
};

const list = async (req, res) => {
  let artistId = req.params.artistId;
  try {
    let totalAlbums = await Album.find({ artist: artistId }).countDocuments();
    let albums = await Album.find({ artist: artistId }).sort("title");
    if (!albums) {
      return res.status(404).send({
        status: "error",
        message: "No hay albums para mostrar",
      });
    } else {
      return res.status(200).send({
        status: "success",
        total: totalAlbums,
        albums,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al buscar los albums",
    });
  }
};

const update = async (req, res) => {
  let albumId = req.params.id;
  let update = req.body;

  try {
    let albumUpdated = await Album.findByIdAndUpdate(albumId, update, {
      new: true,
    });

    if (!albumUpdated) {
      return res.status(404).send({
        status: "error",
        message: "No se ha actualizado el album",
      });
    } else {
      return res.status(200).send({
        status: "success",
        album: albumUpdated,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al actualizar el album",
    });
  }
};
const upload = async (req, res) => {
  // recoger artist id
  let albumId = req.params.id;

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
  let imageAlbum = await Album.findByIdAndUpdate(
    { _id: albumId },
    { image: req.file.filename },
    { new: true }
  );
  if (!imageAlbum) {
    return res.status(500).send({ error: "Error al subir la imagen" });
  }
  return res.status(200).send({
    status: "success",
    message: "Método de upload",
    artist: imageAlbum,
    file: req.file,
  });
};

const image = async (req, res) => {
  // Sacar el parametro de la url
  const file = req.params.file;

  // montar el path real de la imagen
  const filePath = path.resolve(__dirname, "../uploads/albums", file);

  // comprobar si existe la imagen
  fs.stat(filePath, (exists) => {
    if (exists) {
      return res.status(400).send({
        status: "Error",
        message: "does not exist",
        avatar: file,
      });
    }
    // devolver
    return res.sendFile(filePath);
  });
};
const remove = async (req, res) => {
  let id = req.params.id;
  try {
    let albumRemove = await Album.findById(id).remove();
    let songRemove = await Song.deleteMany({ album: id }).remove();

    return res.status(200).send({
      status: "success",
      message:
        "El artista y sus álbumes y canciones asociadas se han eliminado",
      albumRemove,
      songRemove,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error al eliminar el album", error });
  }
};
module.exports = {
  prueba,
  save,
  one,
  list,
  update,
  upload,
  image,
  remove,
};
