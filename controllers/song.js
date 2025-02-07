const path = require("path");
const Songs = require("../models/songs");
const fs = require("fs");

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
    let songs = await Songs.find({ album: albumId })
      .populate({
        path: "album",
        populate: { path: "artist" },
      })
      .sort("track");
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

const update = async (req, res) => {
  let songId = req.params.id;
  let update = req.body;

  try {
    let updatedSong = await Songs.findByIdAndUpdate(songId, update, {
      new: true,
    });
    if (!updatedSong) {
      return res.status(404).send({
        status: "error",
        message: "La cancion no se ha actualizado",
      });
    } else {
      return res.status(200).send({
        status: "success",
        song: updatedSong,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al actualizar la cancion",
      error: error,
    });
  }
};

const erase = async (req, res) => {
  let songId = req.params.id;
  try {
    let songDeleted = await Songs.findByIdAndDelete(songId);
    if (!songDeleted) {
      return res.status(404).send({
        status: "error",
        message: "La cancion no se encuentra para ser borrada",
      });
    } else {
      return res.status(200).send({
        status: "success",
        song: songDeleted,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al borrar la cancion",
      error: error,
    });
  }
};

const upload = async (req, res) => {
  // recoger artist id
  let songId = req.params.id;

  // Recoger fichero y comprobar si existe
  if (!req.file) {
    return res.status(404).send({ error: "La peticion no incluye cancion" });
  }
  // conseguir nombre del archivo
  let song = req.file.originalname;
  // sacar extension de la imagen
  let songSplit = song.split(".");
  const extension = songSplit[1];
  // comprobar extension (solo imagenes), si no es valida borrar archivo subido
  if (
    extension != "mp3" &&
    extension != "ogg" 
  ) {
    // borrar archivo subido
    const filePath = req.file.path;
    const fileDelete = fs.unlinkSync(filePath);
    // devolver el error
    return res
      .status(400)
      .send({ error: "La extension de la cancion no es válida" });
  }
  // Si es correcto guardar imagen en la bbdd
  let songTrack = await Songs.findByIdAndUpdate(
    { _id: songId },
    { file: req.file.filename },
    { new: true }
  );
  if (!songTrack) {
    return res.status(500).send({ error: "Error al subir la cancion" });
  }
  return res.status(200).send({
    status: "success",
    message: "Método de upload",
    artist: songTrack,
    file: req.file,
  });
};

const audio = async (req, res) => {
// Sacar el parametro de la url
const file = req.params.file;

// montar el path real de la imagen
const filePath = path.resolve(__dirname, "../uploads/songs", file);

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
  erase,
  upload,
  audio,
};
