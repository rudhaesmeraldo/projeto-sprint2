const Parser = require('rss-parser');
const parser = new Parser();
const {traduzConteudo} = require('../services/deeplService')
const fs = require('fs');
const { json } = require('stream/consumers');

async function obterNoticias(req, res) {
  try {
    const feed = await parser.parseURL('https://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss');

    let noticiasPromises = feed.items
    .slice(0,8)
    .map(async item => ({
      titulo: await traduzConteudo(item.title),
      link: item.link,
      data: item.pubDate,
      descricao: await traduzConteudo(item.contentSnippet),
      imagem:item.enclosure?.url || null
    }));


    
    let noticiasTraduzidas = await Promise.all(noticiasPromises)
    fs.writeFileSync('./src/data/noticias-pt-br.json', JSON.stringify(noticiasTraduzidas)) 
    res.json(noticiasTraduzidas);
  } catch (erro) {
    console.error('Erro ao buscar o feed:', erro.message);
    res.status(500).json({ erro: 'Erro ao obter feed RSS' });
  }
}

module.exports = { obterNoticias };
''