const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { uploadParaS3 } = require('./src/services/s3Service');

const arquivosJSON = [
  'nasa.gov_aeronautics_feed_.json',
  'nasa.gov_feeds_iotd-feed_.json',
  'nasa.gov_missions_station_feed_.json',
];

(async () => {
  for (const nomeArquivo of arquivosJSON) {
    const caminho = path.join(__dirname, 'src', 'data', nomeArquivo);
    try {
      const conteudo = fs.readFileSync(caminho, 'utf-8');
      const json = JSON.parse(conteudo);

      const url = await uploadParaS3(nomeArquivo, json);
      console.log(`✅ Enviado com sucesso: ${nomeArquivo}`);
      console.log(`URL pública: ${url}`);
    } catch (erro) {
      console.error(`Erro ao enviar ${nomeArquivo}:`, erro.message);
    }
  }
})();
