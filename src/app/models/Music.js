const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MusicSchema = new Schema(
    {
        name: { type: String, maxLength: 255, required: true },
        singer: { type: String, maxLength: 255, required: true },
        path: { type: String, maxLength: 255, required: true },
        image: { type: String },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Music', MusicSchema);
