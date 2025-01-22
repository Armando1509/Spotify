const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ArtistController = require('../controllers/artirts');
const check = require("../middlewares/auth");

// configurar multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, "../uploads/artists"),
    filename: (req, file, cb) => {
      cb(null, "artists-" + Date.now() + "-" + file.originalname);
    },
  });
  
  const uploads= multer({storage})

// definir rutas
router.get('/prueba', ArtistController.prueba);
router.post('/save', check.auth, ArtistController.save);
router.get('/one/:id', check.auth, ArtistController.one);
router.get('/list/:page?', check.auth, ArtistController.list);
router.put('/update/:id', check.auth, ArtistController.update);
router.delete('/remove/:id', check.auth, ArtistController.remove);
router.post("/upload/:id", [check.auth, uploads.single("file0") ], ArtistController.upload);
router.get("/image/:file", ArtistController.image);


module.exports = router;