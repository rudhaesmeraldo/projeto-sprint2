const Parser = require('rss-parser');
const parser = new Parser();

async function obterNoticias(req, res) {
  try {
    const feed = await parser.parseURL('https://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss');

    const noticias = feed.items.map(item => ({
      titulo: item.title,
      link: item.link,
      data: item.pubDate,
      descricao: item.contentSnippet,
      imagem: item.enclosure?.url || null
    }));

    res.json(noticias);
  } catch (erro) {
    console.error('Erro ao buscar o feed:', erro.message);
    res.status(500).json({ erro: 'Erro ao obter feed RSS' });
  }
}

module.exports = { obterNoticias };
''