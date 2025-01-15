const {Schema, model} = require('mongoose');


const SongSchema = Schema({
    albums: {type: Schema.Types.ObjectId, ref: 'Album', required: true},
    album: {type: String, required: true},
    track: {type: Number, required: true},
    name: {type: String, required: true},
    duration: {type: String, required: true},
    file: {type: String, required: true},
    create_at: {type: Date, default: Date.now}
})

module.exports = model('Song', SongSchema, 'songs');