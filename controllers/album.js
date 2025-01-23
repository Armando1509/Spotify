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
  // paginacion
  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }
  let itemsPerPage = 5;
  // buscar los albums del artista que me llega por params
  try {
    let albums = await Album.find({ artist: artistId })
      /* .populate("artist") */
      .sort("title")
      .paginate(page, itemsPerPage);
    if (!albums) {
      return res.status(404).send({
        status: "error",
        message: "No hay albums para mostrar",
      });
    } else {
      return res.status(200).send({
        status: "success",
        albums,
       /*  totalItems: totalAlbums,
        pages: Math.ceil(totalAlbums / itemsPerPage), */
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al buscar los albums",
    });
  }
};

module.exports = {
  prueba,
  save,
  one,
  list,
};
