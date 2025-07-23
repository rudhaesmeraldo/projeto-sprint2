const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const stream = require('@aws-sdk/util-stream');


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //sessionToken: process.env.AWS_SESSION_TOKEN, 
  }
});

async function uploadParaS3(nomeArquivo, conteudoJSON) {
  const comando = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: nomeArquivo,
    Body: JSON.stringify(conteudoJSON, null, 2),
    ContentType: 'application/json',
  });

  try {
    await s3.send(comando);
    console.log(`✅ Arquivo enviado para o S3: ${nomeArquivo}`);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${nomeArquivo}`;
  } catch (erro) {
    console.error('❌ Erro ao enviar para o S3:', erro.message);
    throw erro;
  }
}

async function retornaArquivoDoS3(nomeArquivo){
  const comando = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: nomeArquivo
  })
  
  try{
    const resposta = await s3.send(comando)
    const chunks = [];
    for await (const chunk of resposta.Body) {
      chunks.push(chunk);
    }
    const conteudoString = Buffer.concat(chunks).toString('utf-8');
    const conteudoJSON = JSON.parse(conteudoString);
    
    console.log(`✅ Arquivo JSON recebido do S3: ${nomeArquivo}`);
    return conteudoJSON
  }catch(erro){
    console.log('Erro ao receber JSON do S3:', erro.message)
  }
}

module.exports = { uploadParaS3, retornaArquivoDoS3 };
