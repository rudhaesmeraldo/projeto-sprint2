const express = require('express');
const router = express.Router();
const { obterNoticias } = require('../controllers/rssController');

router.get('/', obterNoticias);

module.exports = router;
