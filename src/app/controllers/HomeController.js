const Song = require('../models/Music');

class HomeController {
    // [GET] /
    index(req, res) {
        res.render('home');
    }

    // [GET] /api-songs
    getApiListSongs(req, res, next) {
        Song.find({})
            .then((songs) => {
                res.json(songs);
            })
            .catch(next);
    }
}

module.exports = new HomeController();
