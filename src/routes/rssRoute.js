const express = require('express');
const router = express.Router();
const { obterNoticias, obterNoticiasAeronautica } = require('../controllers/rssController');

router.get('/', obterNoticias); 
router.get('/aeronautica', obterNoticiasAeronautica); 

module.exports = router;
