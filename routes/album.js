const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const AlbumController = require('../controllers/album');
const check = require('../middlewares/auth');

// configurar multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads/albums'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

// definir rutas
router.get('/prueba', AlbumController.prueba);
router.post('/save', check.auth, AlbumController.save);
router.get('/one/:id', check.auth, AlbumController.one);

module.exports = router;