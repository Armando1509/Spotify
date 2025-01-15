const express = require('express');
const router = express.Router();   
const multer = require('multer');
const path = require('path');
const SongController = require('../controllers/song');

// configurar multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads/songs'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

// definir rutas
router.get('/prueba', SongController.prueba);

module.exports = router;