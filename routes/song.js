const express = require('express');
const router = express.Router();   
const multer = require('multer');
const path = require('path');
const SongController = require('../controllers/song');
const check = require('../middlewares/auth');


// configurar multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads/songs'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

// definir rutas
router.get('/prueba', SongController.prueba);
router.post('/save', check.auth, SongController.save);
router.get('/one/:id', check.auth, SongController.one);
router.get('/list/:id', check.auth, SongController.list);

module.exports = router;