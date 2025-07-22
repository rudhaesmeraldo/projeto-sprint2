const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function uploadParaS3(nomeArquivo, conteudoJSON) {
  const comando = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: nomeArquivo,
    Body: JSON.stringify(conteudoJSON, null, 2),
    ContentType: 'application/json',
    ACL: 'public-read'
  });

  try {
    await s3.send(comando);
    console.log(`✅ Arquivo enviado para o S3: ${nomeArquivo}`);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${nomeArquivo}`;
  } catch (erro) {
    console.error('❌ Erro ao enviar para o S3:', erro.message);
    throw erro;
  }
}

module.exports = { uploadParaS3 };
