const { TranslateClient, TranslateTextCommand } = require("@aws-sdk/client-translate");
require('dotenv').config();


const translateClient = new TranslateClient({ region: 'us-east-2'});

async function traduzConteudo(texto, origem, destino){
  const params = {
    Text: texto,
    SourceLanguageCode: origem,
    TargetLanguageCode: destino,
  };

   try {
    const data = await translateClient.send(new TranslateTextCommand(params));
    return data.TranslatedText
  } catch (err) {
    console.error("Erro ao traduzir:", err);
  }
 
}

module.exports = { traduzConteudo };
