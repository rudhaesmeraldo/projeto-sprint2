const express = require('express');
const router = express.Router();
const { obterNoticias, buscarNoticiasNoS3 } = require('../controllers/rssController');

router.get('/noticias', obterNoticias); 
router.get('/buscar-bucket-s3', buscarNoticiasNoS3)

module.exports = router;