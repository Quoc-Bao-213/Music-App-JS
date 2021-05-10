const Song = require('../models/Music');

class SongController {
    // [GET] /songs/create
    create(req, res) {
        res.render('songs/create');
    }

    // [POST] /songs/store
    async store(req, res, next) {
        const song = new Song(req.body);
        song.save()
            .then(() => res.redirect('/'))
            .catch(next);
    }
}

module.exports = new SongController();
