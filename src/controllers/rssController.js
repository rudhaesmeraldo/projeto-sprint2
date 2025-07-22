const Parser = require('rss-parser');
const fs = require('fs');
const { traduzConteudo } = require('../services/deeplService');
const { uploadParaS3 } = require('../services/s3Service');

const parser = new Parser();

async function processarNoticias(feedURL, limite = 8) {
  const feed = await parser.parseURL(feedURL);

  const noticias = feed.items.slice(0, limite).map(async item => ({
    titulo: await traduzConteudo(item.title),
    link: item.link,
    data: item.pubDate,
    descricao: await traduzConteudo(item.contentSnippet),
    imagem: item.enclosure?.url ||
         item['media:content']?.$?.url ||
         (() => {
             const html = item['content:encoded'] || item.content;
             if (!html) return null;
             const match = html.match(/<img[^>]+src="([^">]+)"/);
             return match ? match[1] : null;
         })() ||
         null,
  }));

  return await Promise.all(noticias);
}

async function obterNoticias(req, res) {
  try {
    const feedURL = req.query.feedURL;
    const modo = req.query.modo; 

    if (!feedURL) {
      return res.status(400).json({ error: 'O parâmetro feedURL é obrigatório' });
    }

    
    const noticiasTraduzidas = await processarNoticias(feedURL);
    const noticiasIdiomaOriginal = await processarNoticias(feedURL)

    if (modo === 'arquivo') {
      const fileName = feedURL
        .replace(/^(https?:\/\/)?(www\.)?/i, '')
        .replace(/\.xml$/, '')
        .replace(/[^a-z0-9_.-]/gi, '_')
        .toLowerCase();

      const url = await uploadParaS3(`${fileName}.json`, noticiasTraduzidas);
      return res.json({ 
        fileName, 
        s3Url: url 
      });
    }

    res.json(noticiasIdiomaOriginal);

  } catch (erro) {
    console.error('Erro ao buscar feed RSS:', erro.message);
    res.status(500).json({ erro: 'Erro ao obter e traduzir feed RSS' });
  }
}

module.exports = {
  obterNoticias
}; 