const deepl = require('deepl-node');
require('dotenv').config();

const chaveAPI = process.env.DEEPL_AUTH_KEY;
const tradutor = new deepl.Translator(chaveAPI);

async function traduzConteudo(texto) {
  try {
    const resultado = await tradutor.translateText(texto, null, 'pt-br');
    return resultado.text;
  } catch (error) {
    console.error(' Erro ao traduzir conteúdo:', error.message);
    return texto; //retorna original se erro
  }
}

module.exports = { traduzConteudo };
