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
    const feedURL = req.query.feedURL;
    if(!feedURL) return res.status(404).json({error: 'O parametro feedURL é obrigatorio'})
    const noticiasTraduzidas = await processarNoticias(feedURL);

    let fileName = feedURL
      .replace(/^(https?:\/\/)?(www\.)?/i, '') 
      .replace(/\.xml$/, '') 
      .replace(/[^a-z0-9_.-]/gi, '_') 
      .toLowerCase(); 
    
    fs.writeFileSync(`./src/data/${fileName}.json`, JSON.stringify(noticiasTraduzidas, null, 2));
    res.json({fileName});
  } catch (erro) {
    console.error(' Erro ao buscar feed da imagem do dia:', erro.message);
    res.status(500).json({ erro: 'Erro ao obter e traduzir feed RSS' });
  }
}


module.exports = {
  obterNoticias
};
