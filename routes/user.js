const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');  
const UserController = require('../controllers/user');
const check = require('../middlewares/auth');

// configurar multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads/avatar'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

// definir rutas
router.get('/prueba',check.auth, UserController.prueba);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get("/profile/:id", check.auth, UserController.profile);
router.put("/update/", check.auth, UserController.update);

module.exports = router;