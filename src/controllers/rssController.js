const Parser = require('rss-parser');
const fs = require('fs');
const { traduzConteudo } = require('../services/awsTranslate');
const { uploadParaS3, retornaArquivoDoS3 } = require('../services/s3Service');

const parser = new Parser();

async function processarNoticias(feedURL, limite = 8) {
  const feed = await parser.parseURL(feedURL);

  const noticias = feed.items.slice(0, limite).map(async item => ({
    titulo: await traduzConteudo(item.title , 'en', 'pt'),
    link: item.link,
    data: item.pubDate,
    descricao: await traduzConteudo(item.contentSnippet, 'en', 'pt'),
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

    if (modo === 'arquivo') {
      const fileName = feedURL
        .replace(/^(https?:\/\/)?(www\.)?/i, '')
        .replace(/\.xml$/, '')
        .replace(/[^a-z0-9_.-]/gi, '_')
        .toLowerCase();

      try {
        const url = await uploadParaS3(`${fileName}.json`, noticiasTraduzidas);
        return res.json({
          mensagem: '✅ Arquivo enviado para o S3 com sucesso!',
          fileName,
          s3Url: url
        });
      } catch (uploadErr) {
        console.error('❌ Erro ao enviar para o S3:', uploadErr.message);
        return res.json({
          mensagem: '⚠️ Feed traduzido com sucesso, mas não foi possível enviar para o S3.',
          fileName
        });
      }
    }
    res.json(noticiasTraduzidas);
    
  } catch (erro) {
    console.error('Erro ao buscar feed RSS:', erro.message);
    res.status(500).json({ erro: 'Erro ao obter e traduzir feed RSS' });
  }
}


async function buscarNoticiasNoS3(req, res){
  const fileName = req.query.fileName;
  const noticias = await retornaArquivoDoS3(fileName)
  res.json(noticias)
}

module.exports = {
  obterNoticias,
  buscarNoticiasNoS3
}; 