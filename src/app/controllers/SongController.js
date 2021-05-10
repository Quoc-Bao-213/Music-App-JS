class SongController {
    // [GET] /songs/create
    create(req, res, next) {
        res.render('songs/create');
    }
}

module.exports = new SongController();
