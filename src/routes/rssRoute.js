const express = require('express');
const router = express.Router();
const { obterNoticias, obterNoticiasAeronautica } = require('../controllers/rssController');

router.get('/noticias', obterNoticias); 

module.exports = router;