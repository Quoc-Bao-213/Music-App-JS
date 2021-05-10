const express = require('express');
const router = express.Router();

const songController = require('../app/controllers/SongController');

router.get('/create', songController.create);
router.post('/store', songController.store);

module.exports = router;
