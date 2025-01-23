const Album = require("../models/albums");

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
    let totalAlbums = await Album.find({ artist : artistId }).countDocuments();
    let albums = await Album.find({ artist: artistId })
      .sort("title")
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

module.exports = {
  prueba,
  save,
  one,
  list,
  update,
};
