const express = require('express');
const router = express.Router();

const homeController = require('../app/controllers/HomeController');

router.get('/api-songs', homeController.getApiListSongs);
router.get('/', homeController.index);

module.exports = router;
