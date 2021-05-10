const express = require('express');
const router = express.Router();

const songController = require('../app/controllers/SongController');

router.get('/create', songController.create);

module.exports = router;
