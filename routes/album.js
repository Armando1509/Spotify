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
        cb(null, "album-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });

// definir rutas
router.get('/prueba', AlbumController.prueba);
router.post('/save', check.auth, AlbumController.save);
router.get('/one/:id', check.auth, AlbumController.one);
router.get('/list/:artistId', check.auth, AlbumController.list);
router.put('/update/:id', check.auth, AlbumController.update);
router.post('/upload/:id', [check.auth, uploads.single('file0')], AlbumController.upload);
router.get('/image/:file', AlbumController.image);

module.exports = router;