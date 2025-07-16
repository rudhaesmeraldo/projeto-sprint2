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
    imagem:item.enclosure?.url || null,
  }));

  return await Promise.all(noticias);
}

async function obterNoticias(req, res) {
  try {
    const feedURL = 'https://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss';
    const noticiasTraduzidas = await processarNoticias(feedURL);

    fs.writeFileSync('./src/data/noticias-imagem-do-dia.json', JSON.stringify(noticiasTraduzidas, null, 2));
    res.json(noticiasTraduzidas);
  } catch (erro) {
    console.error(' Erro ao buscar feed da imagem do dia:', erro.message);
    res.status(500).json({ erro: 'Erro ao obter e traduzir feed RSS' });
  }
}

async function obterNoticiasAeronautica(req, res) {
  try {
    const feedURL = 'https://www.nasa.gov/aeronautics/feed/';
    const noticiasTraduzidas = await processarNoticias(feedURL);

    fs.writeFileSync('./src/data/noticias-aeronautica.json', JSON.stringify(noticiasTraduzidas, null, 2));
    res.json(noticiasTraduzidas);
  } catch (erro) {
    console.error(' Erro ao buscar feed da aeronáutica:', erro.message);
    res.status(500).json({ erro: 'Erro ao obter e traduzir feed RSS' });
  }
}

module.exports = {
  obterNoticias,
  obterNoticiasAeronautica,
};
