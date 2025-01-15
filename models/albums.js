const { Schema, model } = require('mongoose');

const AlbumSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = model('Album', AlbumSchema, albums);