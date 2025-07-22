const express = require('express');
const router = express.Router();
const { obterNoticias } = require('../controllers/rssController');

router.get('/noticias', obterNoticias); 

module.exports = router;