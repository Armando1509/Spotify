const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArtistSchema = Schema({
    user : { type: Schema.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Artist', ArtistSchema, artists);