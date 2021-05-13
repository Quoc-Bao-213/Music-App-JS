const Song = require('../models/Music');
const multer = require('multer');

class SongController {
    // [GET] /songs/create
    create(req, res) {
        res.render('songs/create');
    }

    // [POST] /songs/store
    store(req, res) {
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
                    image = `${Date.now()}-${file.originalname}`;
                    callback(null, image);
                } else if (isAudio.includes(file.mimetype)) {
                    audio = `${Date.now()}-${file.originalname}`;
                    callback(null, audio);
                }
            },
        });

        let uploadFile = multer({
            storage: diskStorage,
            fileFilter: (req, file, callback) => {
                if (
                    isImage.includes(file.mimetype) ||
                    isAudio.includes(file.mimetype)
                ) {
                    callback(null, true);
                } else {
                    callback(null, false);
                    return callback(
                        new Error(
                            'Only .png, .jpeg, .jpg and .mp3 format allowed!',
                        ),
                    );
                }
            },
        }).any();

        uploadFile(req, res, (error) => {
            if (error) {
                return res.send(`Error when trying to upload: ${error}`);
            } else {
                const song = new Song({
                    name: req.body.name,
                    singer: req.body.singer,
                    image: './img/' + image,
                    path: './music/' + audio,
                });

                song.save();

                res.redirect('back');
            }
        });
    }
}

module.exports = new SongController();
