const backendURL = 'http://localhost:3000';

async function carregarArquivoNoticias(feedURL) {
  console.log("Chamando backend com feedURL:", feedURL);
  try {
    const response = await fetch(`${backendURL}/rss/noticias?feedURL=${encodeURIComponent(feedURL)}`);
    const data = await response.json(); 
    
    const fileName = data.fileName;    
    if (!fileName) throw new Error('fileName não retornado pelo backend');

    const resJson = await fetch(`${backendURL}/data/${fileName}.json`);
    if (!resJson.ok) throw new Error(`Erro ao buscar arquivo JSON: ${resJson.status}`);

    const noticias = await resJson.json();

    let categoriaFeed = 'Notícia';
    if (feedURL.includes('/aeronautics/')) {
      categoriaFeed = 'NASA Aeronáutics';
    } else if (feedURL.includes('iotd-feed')) {
      categoriaFeed = 'Image of the Day';
    }else if (feedURL.includes('/missions/station/')) {
      categoriaFeed = 'Space Station';
    }

    inserirNoticiasNoDOM(noticias, categoriaFeed);
  } catch (error) {
    console.error("Erro ao carregar notícias:", error);
  }
}

function extrairDominio(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'link';
  }
}

function criarPlaceholderDOM(texto) {
  const div = document.createElement('div');
  div.className = 'placeholder';
  div.textContent = texto;
  return div;
}


function renderizarNoticia(n, categoriaFeed) {
  const item = document.createElement('li');
  item.className = 'card';

  const temImagem = n.imagem && n.imagem.trim() !== '';
  const dataFormatada = new Date(n.data).toLocaleDateString('pt-BR', {
    dateStyle: 'long',
  });
  const dominio = extrairDominio(n.link);

  const blocoVisual = temImagem
    ? `<img src="${n.imagem}" alt="Imagem da notícia" onerror="this.onerror=null;this.replaceWith(criarPlaceholderDOM('${dominio}'));">`
    : `<div class="placeholder">${dominio}</div>`;

  item.innerHTML = `
    ${blocoVisual}
    <div class="conteudo">
      <span class="etiqueta">${categoriaFeed}</span>
      <h3><a href="${n.link}" target="_blank" rel="noopener noreferrer">${n.titulo}</a></h3>
      <small>${dataFormatada}</small>
      <p class="desc">${n.descricao}</p>
    </div>
  `;

  return item;
}


function inserirNoticiasNoDOM(listaNoticias, categoriaFeed) {
  const colunaUnica = document.getElementById('col-aero');
  colunaUnica.innerHTML = ''; 

  listaNoticias.forEach(noticia => {
    const item = renderizarNoticia(noticia, categoriaFeed);
    colunaUnica.appendChild(item);
  });
}


carregarArquivoNoticias('https://www.nasa.gov/feeds/iotd-feed/');
