const path = require("path");
const Songs = require("../models/songs");

const prueba = (req, res) => {
  return res.status(200).send("Modulo de prueba de songs");
};

const save = async (req, res) => {
  let params = req.body;
  let song = new Songs(params);

  try {
    // verifivar si ya existe una cancion con el mismo nombre
    let existingSong = await Songs.findOne({ name: params.name });
    if (existingSong) {
      return res.status(400).send({
        status: "error",
        message: "Ya existe una cancion con ese nombre",
      });
    }
    let songStored = await song.save();
    if (!songStored) {
      return res.status(404).send({
        status: "error",
        message: "La cancion no se ha guardado",
      });
    } else {
      return res.status(200).send({
        status: "success",
        song: songStored,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al guardar la cancion",
      error: error,
    });
  }
};

const one = async (req, res) => {
  let songId = req.params.id;

  try {
    let song = await Songs.findById(songId).populate("album");
    if (!song) {
      return res.status(404).send({
        status: "error",
        message: "La cancion no existe",
      });
    } else {
      return res.status(200).send({
        status: "success",
        song: song,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al buscar la cancion",
      error: error,
    });
  }
};
const list = async (req, res) => {
  // Recoger id del album de la url
  let albumId = req.params.id;
  // Hacer una consulta a la base de datos para sacar las canciones de ese album
  try {
    let totalSongs = await Songs.find({ album: albumId }).countDocuments();
    let songs = await Songs.find({ album: albumId }).populate({
      path: "album",
      populate: { path: "artist" },
    }).sort("track")
    if (!songs) {
      return res.status(404).send({
        status: "error",
        message: "No hay canciones para este album",
      });
    } else {
      return res.status(200).send({
        status: "success",
        totalSongs: totalSongs,
        songs: songs,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al buscar las canciones",
      error: error,
    });
  }
};

module.exports = {
  prueba,
  save,
  one,
  list,
};
