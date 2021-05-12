const Song = require('../models/Music');
const { multipleMongooseToObject } = require('../../util/mongoose');

class HomeController {
    // [GET] /
    index(req, res) {
        res.render('home')
    }

    getApiListSongs(req, res, next) {
        Song.find({})
            .then((songs) => {
                res.json(
                    songs
                );
            })
            .catch(next);
    }
}

module.exports = new HomeController();
