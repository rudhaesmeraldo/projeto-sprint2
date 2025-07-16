const express = require('express');
const router = express.Router();
const { obterNoticias, obterNoticiasAstronautica } = require('../controllers/rssController');

router.get('/', obterNoticias); 
router.get('/aeronautica', obterNoticiasAstronautica); 

module.exports = router;
