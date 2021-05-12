const Song = require('../models/Music');
const multer = require('multer');

class SongController {
    // [GET] /songs/create
    create(req, res) {
        res.render('songs/create');
    }

    // [POST] /songs/store
    store(req, res, next) {
        let audio, image;
        let isImage = ['image/png', 'image/jpeg'],
            isAudio = ['audio/mpeg'];

        let diskStorage = multer.diskStorage({
            destination: (req, file, callback) => {
                let dest;

                if (isImage.includes(file.mimetype)) {
                    dest = 'src/public/img';
                } else if (isAudio.includes(file.mimetype)) {
                    dest = 'src/public/music';
                }

                callback(null, dest);
            },
            filename: (req, file, callback) => {
                if (isImage.includes(file.mimetype)) {
                    image = `${Date.now()}-tqbao-${file.originalname}`;
                    callback(null, image);
                } else if (isAudio.includes(file.mimetype)) {
                    audio = `${Date.now()}-tqbao-${file.originalname}`;
                    callback(null, audio);
                }
            },
        });

        let uploadFile = multer({ storage: diskStorage }).any();

        uploadFile(req, res, (error) => {
            if (error) {
                return res.send(`Error when trying to upload: ${error}`);
            }

            const song = new Song({
                name: req.body.name,
                singer: req.body.singer,
                image: './img/' + image,
                path: './music/' + audio,
            });

            song.save();
        });

        res.redirect('back');
    }
}

module.exports = new SongController();
