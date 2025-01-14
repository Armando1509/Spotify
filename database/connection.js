const mongoose = require('mongoose');

async function connection() {
    try {
        await mongoose.connect('mongodb://localhost:27017/app_musica');
        console.log('Conectado correctamentamente');
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

module.exports = connection;