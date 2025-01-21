const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ArtistController = require('../controllers/artirts');
const check = require("../middlewares/auth");

// configurar multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads/artists'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

// definir rutas
router.get('/prueba', ArtistController.prueba);
router.post('/save', check.auth, ArtistController.save);
router.get('/one/:id', check.auth, ArtistController.one);

module.exports = router;