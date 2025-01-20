const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');  
const UserController = require('../controllers/user');

// configurar multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads/avatar'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

// definir rutas
router.get('/prueba', UserController.prueba);
router.post('/register', UserController.register);

module.exports = router;