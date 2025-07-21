const Parser = require('rss-parser');
const fs = require('fs');
const { traduzConteudo } = require('../services/deeplService');

const parser = new Parser();

async function processarNoticias(feedURL, limite = 8) {
  const feed = await parser.parseURL(feedURL);

  const noticias = feed.items.slice(0, limite).map(async item => ({
    titulo: await traduzConteudo(item.title),
    link: item.link,
    data: item.pubDate,
    descricao: await traduzConteudo(item.contentSnippet),
    imagem: item.enclosure?.url || null,
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

    if (modo === 'arquivo') {
      const fileName = feedURL
        .replace(/^(https?:\/\/)?(www\.)?/i, '')
        .replace(/\.xml$/, '')
        .replace(/[^a-z0-9_.-]/gi, '_')
        .toLowerCase();

      fs.writeFileSync(`./src/data/${fileName}.json`, JSON.stringify(noticiasTraduzidas, null, 2));
      return res.json({ fileName }); 
    }

    res.json(noticiasTraduzidas);

  } catch (erro) {
    console.error('Erro ao buscar feed RSS:', erro.message);
    res.status(500).json({ erro: 'Erro ao obter e traduzir feed RSS' });
  }
}

module.exports = {
  obterNoticias
};  