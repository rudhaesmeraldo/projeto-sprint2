const deepl = require('deepl-node');
require('dotenv').config();

// IMPORTANTE: lembrar de passar a chave para o arquivo .env quando for finalizar o projeto 
const chaveAPI = "2dfcc874-068a-4bdd-a568-14f2c1fb3c12:fx";
// IMPORTANTE: lembrar de passar a chave para o arquivo .env quando for finalizar o projeto 

const tradutor = new deepl.Translator(chaveAPI);

async function traduzConteudo(texto) {
  try {
    const resultado = await tradutor.translateText(texto, null, 'pt-br');
    return resultado.text
  }catch(error){
    console.log(`Erro ao tentar traduzir conteúdo: ${error}`)
  }
}

module.exports = { traduzConteudo };
